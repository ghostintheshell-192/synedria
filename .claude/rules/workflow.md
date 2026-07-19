# Workflow

## Session Start

At the beginning of every session, before starting any work:

1. **Read the latest handoff** in `.memory-bank/` (the most recent `.md` file by date in the filename)
2. **Read any linked files** referenced in the handoff
3. **Cross-reference** with `memory/MEMORY.md` for stable project facts

This ensures continuity between sessions.

---

## Git Workflow

**Quick reference:**

- `main`: production-ready releases only
- `develop`: default branch for development
- `feature/*`, `fix/*`, `docs/*`, `experiment/*`: task branches

**NEVER work on main directly.**

**Typical workflow:**

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/task-name

# Work and commit
git add <files>
git commit -m "feat: descriptive message"

# Merge when complete
git checkout develop
git merge feature/task-name
git push origin develop
```

## Quick Commands

```bash
# Development server
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Supabase local
npx supabase start
npx supabase db reset
npx supabase test db     # run pgTAP database tests (supabase/tests/)
```

## Investigation & Analysis Workflow

When analyzing tech-debt, bugs, or investigating issues:

1. **Read the issue description** in `tech-debt/`
2. **Read `.development/ARCHITECTURE.md`** for project structure
3. **Read files in logical order** following the architecture
4. **Report findings** with summary and location
