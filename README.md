# Synology Storage Tool

Web dashboard for scanning NAS share sizes and managing customer billing Excel files.

---

## Option A — Standalone (DSM 7.0+, Python 3.9)

**1. Install the following packages** via Synology Package Center:
- Python 3.9
- Git Server

**2. Create the `tools` shared folder** so it appears in File Station and has the correct permissions:

1. Go to **DSM Control Panel → Shared Folder → Create**
2. Name it `tools` — DSM will create `/volume1/tools`

**3. SSH into the NAS, clone the repo and run the installer:**
```sh
sudo git clone https://github.com/Applejuicelolmc/syn-tool.git /volume1/tools/syn-tool
cd /volume1/tools/syn-tool
sudo ./install.sh
```

**4. Start:**
```sh
sudo ./start.sh
```

Open `http://<NAS-IP>:9000` in your browser.

---

## Option B — Docker / Container Manager (DSM 7.2+)

**1. Install Git Server** via Synology Package Center.

**2. Create the `tools` shared folder** (see step 2 above).

**3. Clone the repo:**
```sh
sudo git clone https://github.com/Applejuicelolmc/syn-tool.git /volume1/tools/syn-tool
```

**4a. Via SSH:**
```sh
cd /volume1/tools/syn-tool
sudo docker-compose up -d
```

**4b. Via Container Manager UI:**
1. Open **Container Manager → Project → Create**
2. Set project name (e.g. `synology-tool`)
3. Set path to `/volume1/tools/syn-tool`
4. Container Manager detects `docker-compose.yml` automatically
5. Click **Next → Done** — it builds and starts the container

Open `http://<NAS-IP>:9000` in your browser.

> **Note:** The container runs with `privileged: true` — required for accurate share sizes via btrfs tools (same method DSM uses internally).

---

## Updating

```sh
cd /volume1/tools/syn-tool
sudo git pull
sudo ./start.sh
```

---

## Configuration

All settings (share paths, exclusions, retention, billing formula) are available in the **Settings** tab of the web UI.
