# Local Web Messenger

A tiny private chat app for your own network. It runs on a Linux machine and is
opened from any other device's web browser over your LAN or Tailscale. No
accounts, no cloud, no Docker, no build step — just Python, Flask, and SQLite.

## 👉 New here? Read [START_HERE.md](START_HERE.md) first.

That guide walks you through starting and using the app step by step, with
Windows and Linux quick-starts and troubleshooting. The rest of this README is a
short summary.

## Quick start (Linux)

```bash
bash start.sh
```

Then open the address it prints (for example `http://192.168.1.50:8080`) on any
computer on your network. To stop the app, press `Ctrl + C`.

## What's in this project

| File / folder                 | What it is                                       |
| ----------------------------- | ------------------------------------------------ |
| `START_HERE.md`               | **Read this first** — beginner setup & usage     |
| `start.sh`                    | One-step launcher for Linux                      |
| `open-chat.ps1`               | One-click "open the chat" helper for Windows     |
| `app.py`                      | The Flask backend                                |
| `templates/index.html`        | The chat web page                                |
| `static/app.js`               | Browser chat logic (polling, sending)            |
| `static/styles.css`           | Styling                                          |
| `requirements.txt`            | Python dependencies (Flask)                      |
| `PROJECT_CONTEXT.md`          | Architecture and design notes                    |
| `TODO.md`                     | Planned future work                              |
| `CHANGELOG.md`                | History of changes                               |
| `CLAUDE_HANDOFF.md`           | Developer handoff notes                          |

## How it works

The browser asks the Flask app for messages once per second
(`GET /api/messages?after_id=<last id seen>`) and posts new ones
(`POST /api/messages`). Flask stores everything in a local SQLite file
(`messages.db`). There is also a `GET /health` check that returns
`{"status": "ok"}`.

## Configuration

Set these environment variables if the defaults don't suit you:

| Variable   | Default       | Meaning                          |
| ---------- | ------------- | -------------------------------- |
| `HOST`     | `0.0.0.0`     | Network interface to listen on   |
| `PORT`     | `8080`        | Port to listen on                |
| `DATABASE` | `messages.db` | Path to the SQLite database file |

## Good to know

- Intended for a **trusted** home LAN or private Tailscale network.
- There is **no login and no HTTPS yet**, so don't expose it to the public
  internet.
- `messages.db` holds your chat history and is **not** committed to git.

## License

MIT — see [LICENSE](LICENSE).
