# TODO

## High Priority
- Add basic tests for Flask routes. Cover /health, /api/messages, empty message rejection, sender-name trimming, and ordering.
- Add optional access control before any public exposure. A shared password or simple token would reduce accidental LAN access risk.
- Add systemd service instructions or a sample service file. The user will likely want the app to keep running on Linux.
- Clarify production server guidance. Flask development server is fine for tiny trusted LAN use, but docs should explain limits.

## Medium Priority
- Refactor database initialization for easier testing. init_db currently runs at import time.
- Add message backup/export notes. SQLite history is local and should be easy to preserve.
- Improve frontend error display. Replace alert() with inline status text.
- Add optional message deletion after deciding expected behavior for all connected clients.
- Add a simple Linux setup script to reduce copy/paste mistakes.

## Low Priority
- Add WebSockets if polling becomes limiting.
- Add display themes or sender colors.
- Add file attachments with storage limits and validation.
- Add message search once histories grow.
- Add Docker only if the user changes the no-Docker requirement.
