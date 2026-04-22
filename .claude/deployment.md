# Deployment & NAS notes

## NAS details
- Model: Synology DS214, DSM 7.0+
- Python installed via Package Center (Python 3.9)
- Tool path on NAS: `/volume1/tools/syn-tool`
- Run with `sudo` — required for share scanning permissions

## Prerequisites (Synology Package Center)
- Python 3.9
- Git Server

## File Station visibility
Folders created via SSH are not registered Synology shared folders and won't appear in File Station.
Create the shared folder in DSM **before** cloning so it gets proper permissions:
1. **DSM Control Panel → Shared Folder → Create** → name it `tools` (creates `/volume1/tools`)
2. Then clone into it via SSH

If already cloned first, register it afterwards using the same steps — DSM will detect the existing folder instead of creating a new one.

## Deploy workflow (git-based)
Develop anywhere, push to GitHub, pull on the NAS.

**First-time setup on NAS:**
```sh
sudo git clone https://github.com/Applejuicelolmc/syn-tool.git /volume1/tools/syn-tool
cd /volume1/tools/syn-tool
sudo ./install.sh
sudo ./start.sh
```

**Push from dev machine:**
```sh
git add app.py static/index.html
git commit -m "description"
git push
```

**Update on NAS:**
```sh
cd /volume1/tools/syn-tool
sudo git pull
sudo ./start.sh
```

## Known NAS / BusyBox quirks

### `hostname -I` not available
BusyBox doesn't support it. `start.sh` uses instead:
```sh
NAS_IP=$(ip route get 1 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}' | head -1)
[ -z "$NAS_IP" ] && NAS_IP=$(hostname)
```

### Python 3.9 paths
Synology Package Center installs at `/var/packages/Python3.9/target/bin/python3.9`.
`install.sh` and `start.sh` check: `python3.9`, `python3`, `python`, then the Synology-specific path.

## Running locally for development
```sh
python3 app.py        # port 9000
```
Share paths default to `/volume1` — change via Settings tab or edit `data/config.json` for local testing.

## Docker (DSM 7.2+)
```sh
docker-compose up -d
```
Mounts `./data:/app/data` and `/volume1:/volume1:ro`.
