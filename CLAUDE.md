# Synology Storage Tool

Web tool for NAS share scanning and customer billing Excel management.
**Stack:** Python 3.9 + Flask + openpyxl. Single-file SPA (`static/index.html`). No build step.
**Target:** Synology DS214, DSM 7.0+, Python 3.9 from Package Center.

## Critical constraint
**Python 3.9 only.** Use `from typing import Optional` and `Optional[str]` — NOT `str | None` (Python 3.10+).

## Context files (read before making changes)
- `.claude/project_overview.md` — goals, file list, Excel column structure
- `.claude/backend.md` — all API routes, config, data paths, key functions
- `.claude/frontend.md` — JS state, i18n, all functions, sort/resize, mapping diff modal
- `.claude/deployment.md` — NAS details, git workflow, BusyBox quirks
