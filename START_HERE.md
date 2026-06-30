# START HERE 👋

This is the **one file to read first.** It tells you exactly how to start and
use Local Web Messenger, step by step, with no prior knowledge needed.

**What this app is:** a tiny private chat website that runs on your own Linux
machine. Other computers on the same home network (or Tailscale) open it in a
web browser. No accounts, no internet, no cloud. Just you and the people on
your network.

**The simple idea:**

```
Your Linux machine  ---runs the app--->  http://<linux-ip>:8080
Your Windows PC     ---opens a browser-->  the same address
```

The Linux machine is the **host** (it runs the app). Every other device is a
**guest** (it just opens a web page).

---

## ✅ The 3 things to do first

1. **On your Linux machine**, open a terminal in this folder and run:

   ```bash
   bash start.sh
   ```

2. Look at what it prints. You will see a line like:

   ```
   On ANOTHER computer, open: http://192.168.1.50:8080
   ```

   That web address is your chat. Write it down.

3. **On any other computer** (like your Windows PC), open a web browser and go
   to that address. Type your name, type a message, press Enter. Done. 🎉

That's the whole thing. The sections below explain each part in more detail and
help if something doesn't work.

---

## 📂 What file do I open first?

- If you just want to **use the app**: you don't open a file at all — you open a
  **web address** in your browser (see the 3 steps above).
- If you want to **start the app**: run `start.sh` on Linux.
- If you want to **read about the app**: this file (`START_HERE.md`) is the
  right place. `README.md` is a shorter summary.

---

## 🪟 Windows quick start

You have two choices on Windows. Most people want **Option A**.

### Option A — Use Windows only to open the chat (most common)

Here the app runs on your Linux machine, and Windows is just the screen you
chat from.

1. Make sure the app is already running on Linux (see the Linux quick start).
2. On Windows, the easy way is to double-click **`open-chat.ps1`**
   (right-click → *Run with PowerShell*).
   - The first time, it asks for your Linux machine's IP address
     (for example `192.168.1.50`). Type it and press Enter.
   - It remembers the IP, so next time you just press Enter.
   - Your browser opens the chat automatically.
3. The slow way (no script): open a browser and type the address yourself:
   `http://<linux-ip>:8080`

### Option B — Run the app on Windows itself

You can also run the whole app on Windows if you don't have a Linux machine.
Open **PowerShell** in this folder and run these lines one at a time:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Then open `http://localhost:8080` in your browser on that same PC.

> If `python` is not found, install Python from https://www.python.org/downloads/
> and tick **"Add Python to PATH"** during install.

---

## 🐧 Linux quick start

This is the normal way to run the app, because Linux is the host.

### The easy way (recommended)

Open a terminal in this folder and run:

```bash
bash start.sh
```

The script sets everything up the first time and starts the app. Leave that
terminal window open while you chat. To stop the app, press **Ctrl + C**.

### The manual way (if you prefer to see each step)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Both ways do the same thing. `start.sh` just saves you from typing.

---

## 🔁 How to launch the app every day

You do **not** repeat the setup every day. Setup happens once. After that:

**On Linux (the host):**

```bash
bash start.sh
```

Leave the window open while you want the chat available. Press **Ctrl + C** to
stop it.

**On Windows (or any guest):**

- Double-click **`open-chat.ps1`** and press Enter, **or**
- Just open the saved web address in your browser.

That's the daily routine: start it on Linux, open it on your other devices.

> Tip: if you want the app to start automatically when the Linux machine boots,
> that's a more advanced step (a "systemd service"). It's intentionally left
> out for now to keep things simple — see `docs/development/TODO.md`.

---

## 💻 How to open it from another computer

Any device on the **same network** (another laptop, a phone, a tablet) can join.

1. On the **Linux host**, find its network address. The `start.sh` script
   prints it for you, or you can run:

   ```bash
   hostname -I
   ```

   Use the first address it shows (for example `192.168.1.50`).
   If you use **Tailscale**, run `tailscale ip -4` instead and use that address.

2. On the **other computer**, open a web browser and type:

   ```
   http://192.168.1.50:8080
   ```

   (Replace `192.168.1.50` with your real address. Keep the `:8080` at the end.)

3. Everyone who opens that address is in the same chat. Pick a name at the top
   and start typing.

> The other computer must be able to reach the Linux machine — same Wi-Fi /
> network, or both on Tailscale. It will **not** work over the public internet,
> and that's on purpose (there is no login yet).

---

## 🛠️ Troubleshooting

Work through these in order. Each one is a common, fixable problem.

### ❌ The page cannot open / browser says "can't reach this site"

- Is the app actually running on the Linux machine right now? Look at the
  terminal where you ran `start.sh` — it should still be open and **not** show
  an error. If it's closed, start it again.
- Did you include the port? The address must end with **`:8080`**, like
  `http://192.168.1.50:8080`.
- Try opening it **on the Linux machine itself** first: `http://localhost:8080`.
  - If that works but other computers can't reach it → it's a **network or
    firewall** problem (see below).
  - If even that doesn't work → the **app isn't running** (see below).

### ❌ Wrong IP address

- IP addresses can change when a machine reconnects to the network. If it
  worked yesterday but not today, re-check the address:

  ```bash
  hostname -I
  ```

  Use the **first** value. Update the address in your browser (and re-run
  `open-chat.ps1` on Windows and type the new IP when asked).
- Don't use `127.0.0.1` or `localhost` from a *different* computer — those mean
  "this same computer." From another device you need the Linux machine's real
  network IP (like `192.168.x.x`) or its Tailscale IP.

### ❌ Firewall is blocking it

If `localhost:8080` works on the Linux machine but other computers can't connect,
the Linux firewall is probably blocking port 8080. Allow it:

- **Ubuntu / Debian (ufw):**

  ```bash
  sudo ufw allow 8080/tcp
  ```

- **Fedora / RHEL (firewalld):**

  ```bash
  sudo firewall-cmd --add-port=8080/tcp
  ```

  (Add `--permanent` and then `sudo firewall-cmd --reload` to keep it after reboot.)

If you're on **Tailscale**, make sure both devices are signed in to the same
Tailscale account and run `tailscale status` to confirm they see each other.

### ❌ The app is not running

- Start it: `bash start.sh` on the Linux machine.
- If `start.sh` shows an error about **"port already in use"**, the app may
  already be running in another window, or another program is using port 8080.
  You can run it on a different port:

  ```bash
  PORT=9090 bash start.sh
  ```

  Then open `http://<linux-ip>:9090` instead.
- If you see an error about **Flask not found**, the setup step didn't finish.
  Run `start.sh` again — it installs Flask automatically.

### Still stuck? Quick health check

On the Linux machine, run:

```bash
curl http://localhost:8080/health
```

- If you see `{"status":"ok"}` → the app is running fine, and your problem is
  network/firewall/IP related (look above).
- If you see an error → the app is not running. Start it with `bash start.sh`.

---

## 📌 Quick reference card

| I want to…                       | Do this                                      |
| -------------------------------- | -------------------------------------------- |
| Start the app (Linux)            | `bash start.sh`                              |
| Stop the app                     | Press `Ctrl + C` in that terminal            |
| Find the Linux IP                | `hostname -I` (or `tailscale ip -4`)         |
| Open the chat (any device)       | Browser → `http://<linux-ip>:8080`           |
| Open the chat (Windows, easy)    | Double-click `open-chat.ps1`                 |
| Check the app is alive           | `curl http://localhost:8080/health`          |
| Use a different port             | `PORT=9090 bash start.sh`                     |

Happy chatting! For deeper technical details, see `README.md` and
`docs/development/PROJECT_CONTEXT.md`.
