# Tech Debt Issues

This folder contains individual technical debt issues for Synedria.

## Structure

Each issue is a separate markdown file with standardized frontmatter:

```yaml
---
type: [bug|feature|refactor|performance|testing|code-quality|security]
priority: [high|medium|low]
status: [open|in-progress|resolved|closed|rejected]
discovered: YYYY-MM-DD
related: []  # List of related issue filenames
related_decision: null  # Optional: link to reference/decisions/ADR-NNN-name.md
---
```

## Workflow

### Creating New Issues

1. Copy `_TEMPLATE.md`
2. Rename to descriptive slug: `issue-name.md` (NO DATE PREFIX)
3. Fill in frontmatter and content
4. Status starts as `open`

### Working on Issues

1. Update status to `in-progress`
2. Work on fix/implementation
3. When complete, add resolution sections (Solution, Testing, Impact)

### Archiving Completed Issues

**Automatic**: set status to `resolved`, `closed`, or `rejected` in the
frontmatter and commit. The `03-archive-resolved-issues` pre-commit hook
moves the file to `../archive/completed/` with a date prefix.

## Current Issues by Priority

*Auto-updated: 2026-07-20 21:30*

**High Priority:**
- `group-tag-model-single-and-coarse.md` - Group tag model is single + coarse (no curated multi-tags)
- `oauth-identities-not-linked.md` - One person signing in with two OAuth providers becomes two users
- `production-schema-untracked.md` - Production schema is applied by hand and tracked nowhere

**Medium Priority:**
- `test-coverage-certification-catalog.md` - No pgTAP coverage for the certification catalog (migration 00008)
- `test-coverage-group-objective.md` - No pgTAP coverage for group objective nullability (migration 00010)
- `untyped-supabase-client.md` - Supabase client is untyped (no Database generic)

**Low Priority:**
- `certification-badge-prominent-layout.md` - Prominent certification badge takes a full row on the group page
- `group-edit-missing.md` - No group-edit flow — referent cannot change a group after creation
- `onboarding-prompt-copy.md` - Onboarding profile-completion copy needs improvement

## Integration with Reference Documentation

If an issue relates to an architectural decision, link it:

```yaml
---
related_decision: 001-skill-tags-free-text.md
---
```

If resolving an issue requires a significant architectural choice, record it
as a new ADR in `../reference/decisions/` (copy `_TEMPLATE.md`) and link it
back from the issue.

## Tips

- Use descriptive slugs for filenames
- Keep frontmatter up to date
- Date prefix ONLY when archiving (handled automatically by the hook)
- Check `_TEMPLATE.md` for structure
