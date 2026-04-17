# Deployment & NAS notes

## NAS details
- Model: Synology DS214, DSM 7.0+
- Python installed via Package Center (Python 3.9)
- Tool path on NAS: `/volume1/tools/syn-tool`
- Run with `sudo` — required for share scanning permissions

## Deploy workflow (git-based)
Develop anywhere, push to GitHub, pull on the NAS.

**Push from dev machine:**
```sh
git add app.py static/index.html
git commit -m "description"
git push
```

**Pull on NAS (SSH):**
```sh
cd /volume1/tools/syn-tool
sudo git pull
sudo sh start.sh
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
python3 app.py        # port 8080
```
Share paths default to `/volume1` — change via Settings tab or edit `data/config.json` for local testing.

## Docker (DSM 7.2+)
```sh
docker-compose up -d
```
Mounts `./data:/app/data` and `/volume1:/volume1:ro`.
