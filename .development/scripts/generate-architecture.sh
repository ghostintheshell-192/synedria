#!/bin/bash
# Generate ARCHITECTURE.md with project tree and file descriptions.
# Descriptions are extracted by a language-specific extract-summary script.
#
# Usage: .development/scripts/generate-architecture.sh

set -e

# ─── Common Setup ─────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEV_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$DEV_DIR")"
OUTPUT_FILE="$DEV_DIR/ARCHITECTURE.md"
ADR_DIR="$DEV_DIR/reference/decisions"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# ─── Project Configuration ────────────────────────────────────────────
# Modify this section for each project.

PROJECT_NAME="Synedria"
FILE_GLOBS=("*.ts" "*.tsx")
SKIP_FILES=("next-env.d.ts")
EXCLUDE_DIRS=("node_modules" ".next" "dist" "build" "coverage")
EXTRACT_CMD="python3 $SCRIPT_DIR/extract-summary.py"
MAX_DESC_LENGTH=200
DOCS_REF="\`docs/\`"

# Source directories to scan
SOURCE_DIRS=("$PROJECT_ROOT/src")
# Base for relative path calculation
REL_BASE="$PROJECT_ROOT"

# Project-specific header content
generate_project_header() {
    cat << 'EOF'
## Stack Overview

| Layer | Technology | Role |
|-------|-----------|------|
| Frontend + API | Next.js (App Router) | UI and server logic in one project |
| Database + Auth | Supabase | PostgreSQL, authentication, RLS |
| Deployment | Vercel | Hosting, HTTPS, auto-deploy from GitHub |
| Maps | Leaflet + OpenStreetMap | Static neighborhood maps |

## Layer Overview

```text
Browser (Client)
    |
    v
Next.js App Router
    ├── app/            # Pages (SSR + client)
    ├── components/     # Reusable UI components
    ├── lib/            # Shared logic
    │   ├── supabase/   # DB client, types, helpers
    │   └── utils/      # Utility functions
    └── types/          # Shared TypeScript types
    |
    v
Supabase
    ├── Auth            # OAuth (GitHub, Google, Apple)
    ├── PostgreSQL      # Data storage with RLS
    └── Migrations      # Schema versioning
```

## Database Schema

Full consolidated schema with tables, enums, RLS policies, triggers, and relationships:
**[Database Schema](reference/technical/database-schema.md)**

8 tables: `profiles`, `user_skills`, `groups`, `group_members`, `join_requests`, `check_ins`, `check_in_attendees`, `progress_updates`.
EOF
}

# ─── Generic Logic (same across projects) ──────────────────────────────

is_excluded_dir() {
    local dirname="$1"
    for excl in "${EXCLUDE_DIRS[@]}"; do
        [[ "$dirname" == "$excl" ]] && return 0
    done
    return 1
}

is_skipped_file() {
    local filename="$1"
    for skip in "${SKIP_FILES[@]}"; do
        [[ "$filename" == "$skip" ]] && return 0
    done
    return 1
}

generate_adr_list() {
    if [[ ! -d "$ADR_DIR" ]]; then
        echo "- See \`reference/decisions/\` for architecture decisions"
        return
    fi

    local found=false
    for adr in "$ADR_DIR"/[0-9]*.md; do
        [[ -f "$adr" ]] || continue
        found=true
        local filename number title summary impact line
        filename=$(basename "$adr" .md)
        number="${filename%%-*}"
        # Real H1 title (strip leading "# " and the "ADR-NNN:" prefix), not the slug.
        title=$(head -1 "$adr" | sed 's/^#[[:space:]]*//; s/^ADR-[0-9]*:[[:space:]]*//')
        summary=$(grep -m1 "^\*\*Summary\*\*:" "$adr" | sed 's/^\*\*Summary\*\*:[[:space:]]*//')
        impact=$(grep -m1 "^\*\*Impact\*\*:" "$adr" | sed 's/^\*\*Impact\*\*:[[:space:]]*//')
        line="- [ADR-$number: $title](reference/decisions/$filename.md)"
        [[ -n "$impact" ]] && line="$line \`[$impact]\`"
        [[ -n "$summary" ]] && line="$line — $summary"
        printf '%s\n' "$line"
    done

    if [[ "$found" == false ]]; then
        echo "*No ADRs yet - will be added as development progresses.*"
    fi
}

generate_header() {
    echo "# Architecture Reference"
    echo ""
    echo "Quick reference for navigating the $PROJECT_NAME codebase."
    echo "For detailed documentation, see $DOCS_REF."
    echo ""

    generate_project_header

    echo ""
    echo "## Key Decisions"
    echo ""

    generate_adr_list

    echo ""
    echo "## Project Tree"
    echo ""
    echo "> Auto-generated from source code."
    echo "> Run \`.development/scripts/generate-architecture.sh\` to update."
    echo ""
}

process_directory() {
    local dir="$1"
    local reldir="${dir#$REL_BASE/}"

    # Get files matching any of the globs
    local files=()
    for glob in "${FILE_GLOBS[@]}"; do
        while IFS= read -r -d '' file; do
            files+=("$file")
        done < <(find "$dir" -maxdepth 1 -name "$glob" -type f -print0 2>/dev/null)
    done

    # Sort files
    IFS=$'\n' files=($(printf '%s\n' "${files[@]}" | sort)); unset IFS

    # Filter out skipped files
    local filtered=()
    for filepath in "${files[@]}"; do
        local filename=$(basename "$filepath")
        is_skipped_file "$filename" || filtered+=("$filepath")
    done

    # Only print header if there are non-skipped files
    if [[ ${#filtered[@]} -gt 0 ]]; then
        echo ""
        echo "### $reldir"

        for filepath in "${filtered[@]}"; do
            local file=$(basename "$filepath")
            local desc=$($EXTRACT_CMD "$filepath" 2>/dev/null || true)

            if [[ -z "$desc" ]]; then
                echo "- \`$file\`"
            elif [[ ${#desc} -gt $MAX_DESC_LENGTH ]]; then
                echo "- \`$file\` — ${desc:0:$MAX_DESC_LENGTH}..."
            else
                echo "- \`$file\` — $desc"
            fi
        done
    fi

    # Process subdirectories
    local subdirs=()
    while IFS= read -r -d '' subdir; do
        subdirs+=("$subdir")
    done < <(find "$dir" -maxdepth 1 -mindepth 1 -type d -print0 2>/dev/null | sort -z)

    for subdir in "${subdirs[@]}"; do
        local dirname=$(basename "$subdir")
        is_excluded_dir "$dirname" && continue
        process_directory "$subdir"
    done
}

generate_tree() {
    for source_dir in "${SOURCE_DIRS[@]}"; do
        [[ -d "$source_dir" ]] || continue
        process_directory "$source_dir"
    done
}

generate_footer() {
    echo ""
    echo "---"
    echo ""
    echo "*Auto-generated by \`.development/scripts/generate-architecture.sh\`*"
}

main() {
    echo "Generating architecture reference..."

    {
        generate_header
        generate_tree
        generate_footer
    } > "$OUTPUT_FILE"

    echo -e "${GREEN}Generated:${NC} $OUTPUT_FILE"

    # Stats
    local total=0
    local missing=0

    for source_dir in "${SOURCE_DIRS[@]}"; do
        [[ -d "$source_dir" ]] || continue
        for glob in "${FILE_GLOBS[@]}"; do
            while IFS= read -r -d '' filepath; do
                local filename=$(basename "$filepath")
                is_skipped_file "$filename" && continue
                ((total++)) || true
                local desc=$($EXTRACT_CMD "$filepath" 2>/dev/null || true)
                if [[ -z "$desc" ]]; then
                    ((missing++)) || true
                fi
            done < <(find "$source_dir" -name "$glob" -type f \
                $(printf "! -path '*/%s/*' " "${EXCLUDE_DIRS[@]}") \
                -print0 2>/dev/null)
        done
    done

    echo ""
    echo "Stats: $total files, $missing without summary"

    if [[ $missing -gt 0 ]]; then
        echo -e "${YELLOW}Tip:${NC} Add JSDoc comments to describe your code"
    fi
}

main "$@"
