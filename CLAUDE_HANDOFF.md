# Claude Code Handoff

## What The Project Currently Is
Local Web Messenger is a tiny LAN/Tailscale browser chat app. It runs on Linux and is opened from Windows at http://<linux-ip>:8080.

Current stack: Python Flask, SQLite, plain HTML/CSS/JavaScript. No Docker, no login, no cloud, no frontend build step.

## What Has Already Been Completed
- Flask server and SQLite persistence.
- Chat API routes for reading and saving messages.
- Health check route returning status ok.
- Browser UI with message bubbles, timestamps, connection status, input, and Send button.
- Enter-to-send and empty message prevention.
- One-second polling for new messages.
- Auto-scroll behavior and scroll preservation.
- README, beginner guide, project report, license, gitignore, and handoff docs.

## What Not To Rewrite
Do not rewrite into React, FastAPI, Docker, WebSockets, or a large architecture unless the user explicitly asks. The user values simplicity and readability.

## Safe Assumptions
- Intended use is trusted LAN or private Tailscale.
- Linux Hermes is the host/server.
- Windows is mainly a browser client.
- messages.db is runtime/private data and should not be committed.
- Public internet exposure is unsafe in the current version.

## Where To Begin
Read README.md, PROJECT_CONTEXT.md, app.py, static/app.js, templates/index.html, static/styles.css, and TODO.md.

## Recommended Next Steps
1. Add pytest tests for current API behavior.
2. Add a systemd service example for Linux autostart.
3. Add optional shared-password protection if requested.
4. Add backup/export notes for messages.db.
5. Improve frontend error display without adding a framework.

## Important Implementation Details
app.py uses HOST, PORT, and DATABASE env vars with simple defaults. init_db runs at import time. The SQLite table is messages(id, client_id, author, body, created_at).

static/app.js uses localStorage for a generated client id and display name. Polling is setInterval(loadMessages, 1000).

## Code Review Notes
Duplicated code: no major duplicated code found.
Dead code: no obvious dead code found.
Unnecessary complexity: current app is simple; avoid adding layers prematurely.
Potential bugs: init_db at import time complicates tests; SQLite may lock under heavier writes; polling runs forever while tab is open; sender identity is browser-local only.
Security concerns: no login, no HTTPS, anyone who reaches the app can read/send messages. Do not expose to public internet.
Performance improvements: polling is fine for small local use; consider WebSockets or longer interval only if needed; consider limiting returned history if database grows large.

## GitHub Commit Guidance
Commit exactly these files:
.gitignore
app.py
requirements.txt
README.md
BEGINNER_SETUP_AND_DETAILS.md
PROJECT_REPORT.md
PROJECT_CONTEXT.md
TODO.md
CHANGELOG.md
CLAUDE_HANDOFF.md
LICENSE
templates/index.html
static/app.js
static/styles.css

Never commit:
messages.db
.venv/
__pycache__/
*.pyc
.env
instance/
*.log

## Final Advice
Preserve the project spirit: small, local, readable, and useful. Setup clarity matters as much as code quality for this user. Prefer small documented improvements over clever rewrites.
