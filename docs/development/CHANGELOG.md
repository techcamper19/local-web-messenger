# Changelog

## 2026-06-30 (repository polish)

### Added
- docs/assets/: real hero screenshot (screenshot.png), editable banner.svg and
  icon.svg, and an asset guide (README.md) explaining how to regenerate each.

### Changed
- Rewrote README.md as a proper open-source landing page: elevator pitch,
  feature list, screenshot, quick start, install, usage, project structure,
  ASCII architecture diagram, "why this exists", roadmap, FAQ, and license.
- Repositioned the project as "a tiny self-hosted LAN messenger" with concrete
  use cases (Windows ↔ Linux, home lab, Raspberry Pi, NAS, AI server, etc.).
- Moved contributor-only docs into docs/development/ (PROJECT_CONTEXT.md,
  CLAUDE_HANDOFF.md, TODO.md, CHANGELOG.md) to keep the repo root user-facing.
- Updated internal doc links and the documented directory structure to match.

### Notes
- No code or feature changes; app.py, templates, and static assets are unchanged.

## 2026-06-30 (beginner usability)

### Added
- START_HERE.md: a single beginner-friendly guide covering first steps,
  Windows and Linux quick starts, the daily launch routine, opening from
  another computer, and troubleshooting (page cannot open, wrong IP, firewall
  blocked, app not running).
- start.sh: one-step Linux launcher that creates the virtual environment,
  installs Flask, prints the network address to open, and starts the app.
- open-chat.ps1: Windows helper that remembers the Linux IP and opens the chat
  in the browser.

### Changed
- README.md now points to START_HERE.md and summarises the project briefly.
- .gitignore ignores last-ip.txt (written by open-chat.ps1) and *.db files.

### Verified
- Browser smoke test: page loads, status shows "Connected", a sent message
  renders as a bubble.
- start.sh runs the full setup-and-launch flow successfully.

## 2026-06-30 (initial build)

### Added
- Created Flask backend in app.py.
- Added SQLite message storage.
- Added GET /, GET /api/messages, POST /api/messages, and GET /health.
- Added config defaults through HOST, PORT, and DATABASE environment variables.
- Added plain HTML chat page.
- Added plain CSS messenger styling.
- Added plain JavaScript client behavior.
- Added message bubbles, timestamps, bottom input, Send button, and Enter-to-send.
- Added one-second polling for new messages.
- Added auto-scroll when near bottom and scroll preservation when reading old messages.
- Added connection status indicator.
- Added sender name storage in browser localStorage.
- Added empty-message prevention and sender-name trimming.
- Added requirements.txt, README.md, MIT LICENSE, and .gitignore.
- Added PROJECT_CONTEXT.md, TODO.md, CHANGELOG.md, and CLAUDE_HANDOFF.md for developer handoff.

### Verified
- python -m py_compile app.py passes.
- node --check static/app.js passes.
- Flask dependency is installed locally.
- Flask test client verified /health, /, GET /api/messages, and POST /api/messages.
- Earlier browser testing confirmed send/render behavior and polling behavior.

### Cleaned
- Removed generated messages.db from the handoff folder.
- Removed __pycache__/.
- Removed local instance/ verification database folder.
- Removed local AGENTS.md memory/context file from the project folder.

### Known Limitations
- No login or authentication.
- No HTTPS.
- No WebSockets.
- No automated test files yet.
- Uses Flask development server for simple local running.
