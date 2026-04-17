# Backend — app.py

## Data paths (all under DATA_DIR, default `./data`)
```
data/
  current.json          — active Excel data { headers, rows, _meta }
  config.json           — user settings
  mappings.json         — customer→share mappings (persisted across uploads)
  uploads/              — raw uploaded .xlsx/.xls files
  edits/                — JSON snapshots of current.json taken before each save
  mappings_history/     — JSON snapshots of mappings.json taken before each change
```

## DEFAULT_CONFIG
```python
DEFAULT_CONFIG = {
    "share_paths":    ["/volume1"],
    "exclude_shares": ["@eaDir", "@sharebin", "#recycle", "@tmp", "homes"],
    "upload_retention": 10,
    "edit_retention":   10,
    "mailbox_gb":       10,   # GB free per mailbox in billing formula
}
```

## API Routes

### `GET /api/shares`
Returns `{ shares: [...], volumes: {...} }`.
- Scans each path in `share_paths`; skips names in `exclude_shares` and names starting with `@`/`#`
- Each share: `{ name, path, base, size_bytes, size_gb, size_human }`
  - `base` = volume root (e.g. `/volume1`) — used by frontend to look up volume stats
- Volumes keyed by base path: `{ total_bytes, free_bytes, used_bytes, total_human, free_human }`
- Uses `os.statvfs()` for volume-level disk stats; `du -sb <path>` for share size (fallback: recursive scandir)

### `GET /api/excel/current`
Returns `current.json` or empty `{ headers:[], rows:[], _meta:{} }`.

### `POST /api/excel/upload`
- Multipart `file` field (.xlsx or .xls)
- Saves raw file to `uploads/`, parses, applies stored mappings, writes `current.json`
- Returns `{ success, data, mapping_diff }` — `mapping_diff.has_diff` triggers diff modal in frontend
- Applies retention to uploads/ and edits/

### `POST /api/excel/save`
- Body: `{ headers, rows, _meta, ... }`
- Snapshots current.json to edits/ first, then overwrites
- Applies edit retention

### `GET /api/excel/export`
- Builds .xlsx via `build_excel()`, returns as download
- Re-inserts billing formula: `=G{ri}-({mailbox_gb}*E{ri})` (column letters auto-detected by keyword)
- Filename: `opslag_YYYYMMDD_HHMMSS.xlsx`

### `GET /api/history`
Returns `{ uploads:[...], edits:[...] }` sorted by mtime descending.

### `POST /api/history/restore/upload/<id>`
Re-parses raw upload file → writes current.json.

### `POST /api/history/restore/edit/<id>`
Restores edits/ snapshot → current.json.

### `GET /api/mappings`
Returns `mappings.json`: `{ key_col, map: { lowercase_customer_name: { share, name }, ... } }`.

### `POST /api/mappings/save`
Body: `{ key_col, updates: [{key, name, share}], remove: [key,...] }`.
Keys are always lowercased. Updates merge; remove deletes entries.

### `GET /api/mappings/history`
Returns `{ snapshots:[...] }` from mappings_history/.

### `POST /api/mappings/restore/<snap_id>`
Restores a mappings snapshot (snapshots current first).

### `GET /api/settings` / `POST /api/settings`
GET returns full config. POST validates, saves, applies retention immediately.
Accepted POST fields: `share_paths` (list), `exclude_shares` (list), `upload_retention` (int 1–100), `edit_retention` (int 1–100), `mailbox_gb` (float ≥ 0).

## Key functions

### `detect_key_col(headers)`
Prefers customer name over contract number:
```python
return _find_col(headers, "klant","naam","customer","name") or _find_col(headers, "contract")
```

### `compute_mapping_diff(headers, rows, mappings)`
Matches rows to stored mappings by `display_name.lower()`. Mutates rows in-place (`row['_share']`).
Returns `{ key_col, applied, new, removed, changed, has_diff }`.

### `build_excel(data, cfg)`
Reconstructs .xlsx from JSON. Detects columns by keyword match:
- mailbox: `"mailbox"`
- gebruikte: `"gebruik"`, `"used storage"`
- factureren: `"factuur"`, `"factureren"`, `"invoice"`

Re-inserts formula using detected column letters and `mailbox_gb` config value.

### Retention
`_apply_retention(directory, pattern, keep)` — sorts by mtime, deletes files beyond `keep`.

### Snapshots
`_snapshot_current()` — saves current.json to edits/ before overwriting.
`_snapshot_mappings()` — saves mappings.json to mappings_history/ before overwriting.
