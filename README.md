# Synology Storage Tool

Web dashboard for scanning NAS share sizes and managing customer billing Excel files.

---

## Option A — Standalone (DSM 7.0+, Python 3.9)

**1. Install the following packages** via Synology Package Center:
- Python 3.9
- Git Server

**2. SSH into the NAS, clone the repo and run the installer:**
```sh
sudo git clone https://github.com/Applejuicelolmc/syn-tool.git /volume1/tools/syn-tool
cd /volume1/tools/syn-tool
sudo ./install.sh
```

**3. Start:**
```sh
sudo ./start.sh
```

Open `http://<NAS-IP>:9000` in your browser.

---

## Option B — Docker (DSM 7.2+)

```sh
sudo git clone https://github.com/Applejuicelolmc/syn-tool.git /volume1/tools/syn-tool
cd /volume1/tools/syn-tool
sudo docker-compose up -d
```

Open `http://<NAS-IP>:9000` in your browser.

---

## Updating

```sh
cd /volume1/tools/syn-tool
sudo git -c credential.helper= pull
sudo ./start.sh
```

---

## File Station visibility

The tool folder needs to be registered as a Synology shared folder to appear in File Station. Do this **before** cloning:

1. Go to **DSM Control Panel → Shared Folder → Create**
2. Name it `tools` — DSM will create `/volume1/tools` with the correct permissions
3. Then clone the repo into it via SSH as described above

> If you already cloned first via SSH, you can still register it: same steps, but DSM will detect the existing folder and register it instead of creating a new one.

---

## Configuration

All settings (share paths, exclusions, retention, billing formula) are available in the **Settings** tab of the web UI.
