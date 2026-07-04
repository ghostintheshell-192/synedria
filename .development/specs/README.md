# Feature Specs

Feature specifications for Synedria, organized by lifecycle stage. Each stage
is a subdirectory; a spec moves between them as work progresses.

## Lifecycle

| Directory | Meaning |
| --------- | ------- |
| `backlog/` | Ideas captured but not yet scheduled. |
| `planned/` | Scheduled, spec written, not started. |
| `in-progress/` | Actively being implemented (branch checked out). |
| `implemented/` | Merged into `develop`. |
| `archived/` | Superseded or dropped. |

## Automation

The `spec-workflow.py` script (driven by git hooks) moves a spec between
stages based on branch lifecycle:

- **`post-checkout`** — checking out `feature/<name>` (etc.) moves the matching
  `<name>.md` spec to `in-progress/`.
- **`post-merge`** — merging that branch into `develop` moves it to
  `implemented/`.

Matching is by filename: branch `feature/group-page` matches `group-page.md`.
Specs with a numeric prefix (e.g. `05-group-page.md`) only auto-advance if the
branch name carries the same token (`feature/05-group-page`); otherwise move
them by hand or run `spec-workflow.py done <name>`.
