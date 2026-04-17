# Synology Storage Tool — Project Overview

Web tool for reading NAS share sizes and managing customer billing Excel on Synology DS214 (DSM 7.0+).

**Goal:** Scan NAS shares (sizes only, no file reading), show a web dashboard, manage customer billing Excel (upload/edit/export), retain version history with rollback, persist customer→share mappings across Excel uploads.

**Stack:** Python 3.9 + Flask + openpyxl. Single `static/index.html` frontend — no build step, no npm, no framework.

**Why Python 3.9:** Available in Synology Package Center on DS214 / DSM 7.0 which doesn't support Docker. Docker added for DSM 7.2+.

## Key files
- `app.py` — Flask backend, all API routes (672 lines)
- `static/index.html` — full SPA, Dashboard / Excel / History / Settings tabs (1258 lines)
- `requirements.txt` — `flask>=2.3,<3.0` and `openpyxl>=3.1,<4.0`
- `Dockerfile` + `docker-compose.yml` — for DSM 7.2+
- `install.sh` + `start.sh` — for standalone DSM 7.0 deployment
- `data/` — runtime data (git-ignored): `current.json`, `config.json`, `mappings.json`, `uploads/`, `edits/`, `mappings_history/`

## Python 3.9 constraint
**Always use `from typing import Optional` and `Optional[str]` — NOT `str | None` (Python 3.10+ only).**

## Excel billing sheet (Dutch columns)
`Volgnummer opslag | Contractnummer | Klantnaam | Server | Mailboxen | Licenties | Gebruikte opslag | Te factureren opslag`

Formula: `Te factureren = Gebruikte opslag − (mailbox_gb × Mailboxen)` (default: 10 GB free per mailbox)

`Gebruikte opslag` is auto-populated from NAS share sizes via the NAS Koppeling dropdown.

## For full detail see:
- `.claude/backend.md` — all API routes, config defaults, data paths, key functions
- `.claude/frontend.md` — JS state object, i18n, all functions, column sort/resize, mapping diff modal
- `.claude/deployment.md` — NAS model/paths, git workflow, BusyBox quirks, local dev
