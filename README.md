# Synology Storage Tool

Web dashboard for scanning NAS share sizes and managing customer billing Excel files.

Default login: **admin / admin** — change in Settings after first login.

---

## Option A — Docker / Container Manager (DSM 7.2+)

**1. Clone the repo:**
```sh
sudo git clone https://github.com/Applejuicelolmc/syn-tool.git /volume1/tools/syn-tool
```

**2. Set up as a Project:**
1. Open **Container Manager → Project → Create**
2. Set path to `/volume1/tools/syn-tool`
3. Container Manager detects `docker-compose.yml` automatically
4. Click through — it pulls the image and starts

Open `http://<NAS-IP>:9000`

**Updating (after a code push):**
1. **Project → syn-tool → Actie → Stoppen**
2. **Image → select `ghcr.io/applejuicelolmc/syn-tool` → Delete**
3. **Project → syn-tool → Actie → Starten** — pulls the new image and starts

> The Docker image is built automatically on every push via GitHub Actions. No building on the NAS required.

---

## Option B — Standalone Python (DSM 7.0+)

**1. Install Python 3.9** via Synology Package Center.

**2. Clone and install:**
```sh
sudo git clone https://github.com/Applejuicelolmc/syn-tool.git /volume1/tools/syn-tool
cd /volume1/tools/syn-tool
sudo ./install.sh
sudo ./start.sh
```

Open `http://<NAS-IP>:9000`

**Updating:**
```sh
cd /volume1/tools/syn-tool
sudo git pull
sudo ./start.sh
```

---

## Configuration

All settings (share paths, exclusions, retention, billing, login credentials) are in the **Settings** tab of the web UI.
