# Synedria - Claude Code Project Configuration

This project uses Claude Code's official `.claude/rules/` pattern. All `.md` files in the `rules/` directory are automatically loaded as project instructions.

## Project Rules

The following rules are automatically loaded from `.claude/rules/`:

- **overview.md** - Project overview, development methodology, and tech stack
- **coding-standards.md** - Coding standards and conventions
- **principles.md** - General development principles
- **preflight-checks.md** - Pre-flight checks before coding
- **workflow.md** - Git workflow and development process
- **idea-capture.md** - Convention for parking tangential ideas in `.memory-bank/ideas/`

## Key Decisions

High-impact architecture decisions (ADR `Impact ≥ high`) are auto-generated from the ADRs and loaded into every session via the import below — `critical` ones are constraints that must not be violated, `high` ones are context that shapes ongoing work. Each entry carries a one-line Summary; open the linked ADR for full context. For the complete catalogue see `.development/reference/decisions/` (index in its README).

@key-decisions.md

## Documentation Structure

- **[.development/](.development/)** - Operational documentation
  - **[ARCHITECTURE.md](.development/ARCHITECTURE.md)** - Project tree (auto-generated)
  - **[CURRENT-STATUS.md](.development/CURRENT-STATUS.md)** - Project state
  - `specs/` - Feature specifications
  - `tech-debt/` - Known issues
  - `reference/decisions/` - ADRs
- **[docs/](docs/)** - Public documentation
- **[.personal/](.personal/)** - Personal notes (not tracked)

---

*All rules are automatically loaded by Claude Code. No @includes needed.*
