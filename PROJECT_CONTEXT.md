# Project Context

## Project Purpose
Local Web Messenger is a small browser chat app for a Linux machine such as Hermes. A Windows PC opens it in a browser over LAN or Tailscale.

The project is intentionally local-first: no cloud, no accounts, no Docker, no frontend build step.

## Current Architecture
Browser client -> Flask app -> SQLite database file.

Linux runs python app.py. Windows opens http://<linux-ip>:8080.

## Directory Structure
Local Web Messenger/
- .gitignore
- app.py
- requirements.txt
- README.md
- BEGINNER_SETUP_AND_DETAILS.md
- PROJECT_REPORT.md
- PROJECT_CONTEXT.md
- TODO.md
- CHANGELOG.md
- CLAUDE_HANDOFF.md
- LICENSE
- templates/index.html
- static/app.js
- static/styles.css

Runtime files not to commit: messages.db, .venv/, __pycache__/, *.pyc, .env, instance/, *.log.

## Technology Choices And Why
- Python: common on Linux and easy to run.
- Flask: lightweight and readable for a small local web app.
- SQLite: local file storage with no database server.
- Plain HTML/CSS/JavaScript: no frontend framework or build step.
- One-second polling: simpler than WebSockets and enough for this local use case.

## How Messages Flow Through The System
1. Browser loads GET / from Flask.
2. Flask renders templates/index.html.
3. Browser loads static/styles.css and static/app.js.
4. Browser calls GET /api/messages?after_id=<last_seen_id>.
5. Flask reads messages from SQLite and returns JSON.
6. Browser renders messages as bubbles.
7. Browser sends new messages with POST /api/messages.
8. Flask validates input, saves to SQLite, and returns the saved message.
9. Other browser clients see it on their next one-second poll.

## Current Limitations
- No login or authentication.
- No HTTPS.
- No WebSockets.
- No message deletion or editing.
- No file attachments.
- No user list or presence.
- No automated test files yet.
- Flask development server is used for simple local running.
- init_db runs at module import time, which is simple but awkward for tests.

## Design Decisions Already Made
- Keep the app beginner-friendly and readable.
- Keep backend in app.py until complexity justifies splitting.
- Keep frontend plain HTML/CSS/JS.
- Use SQLite instead of JSON for safer local persistence.
- Use polling instead of WebSockets for simplicity.
- Do not commit messages.db because it may contain private chat history.

## Features Intentionally Postponed
Login, HTTPS, WebSockets, Docker, message delete/edit, admin panel, public internet deployment, systemd service file, and full automated tests.

## Future Roadmap
1. Add pytest tests for API routes.
2. Add optional shared-password protection.
3. Add a systemd service example for Linux autostart.
4. Add database backup/export notes.
5. Consider WebSockets only if polling becomes limiting.

## Known Issues
- Any reachable client can read and send messages.
- HTTP is not encrypted by the app itself.
- SQLite may lock under heavier simultaneous writes.
- init_db at import time makes tests less clean.
- Frontend uses alert() on send failure.

## Coding Style And Conventions
Keep code readable over clever. Prefer standard library and small dependencies. Avoid broad refactors without tests. Keep setup instructions friendly for non-technical users.

## How To Run Locally
Windows PowerShell:
cd C:\Users\YourName\Documents\Local Web Messenger
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py

Then open http://127.0.0.1:8080.

## How To Deploy On Linux
Copy committed files to Linux, then run:
cd ~/local-web-messenger
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py

## How Windows Connects
From Windows, open http://<linux-ip>:8080. Use the LAN IP from hostname -I or Tailscale IP from tailscale ip -4.

## Anything Claude Code Should Know
Do not rewrite into React, FastAPI, Docker, or WebSockets unless explicitly asked. Preserve the local LAN/Tailscale use case and beginner-friendly style. Treat messages.db as private runtime data.
