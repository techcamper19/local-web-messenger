"""Local Web Messenger - a tiny LAN/Tailscale browser chat app.

Run on Linux with:  python3 app.py
Then open from any device on the network at  http://<linux-ip>:8080

Config comes from environment variables with simple defaults:
  HOST      address to bind to        (default 0.0.0.0 = all network interfaces)
  PORT      port to listen on         (default 8080)
  DATABASE  path to the SQLite file   (default messages.db)
"""

import os
import sqlite3
from datetime import datetime, timezone

from flask import Flask, g, jsonify, render_template, request

HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8080"))
DATABASE = os.environ.get("DATABASE", "messages.db")

app = Flask(__name__)


def get_db():
    """Return a per-request SQLite connection, opening one if needed."""
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(exception=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """Create the messages table if it does not exist yet."""
    conn = sqlite3.connect(DATABASE)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id TEXT NOT NULL,
            author TEXT NOT NULL,
            body TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/api/messages", methods=["GET"])
def get_messages():
    """Return messages, optionally only those newer than after_id."""
    after_id = request.args.get("after_id", "0")
    try:
        after_id = int(after_id)
    except ValueError:
        after_id = 0

    rows = get_db().execute(
        "SELECT id, client_id, author, body, created_at "
        "FROM messages WHERE id > ? ORDER BY id ASC",
        (after_id,),
    ).fetchall()

    messages = [dict(row) for row in rows]
    return jsonify({"messages": messages})


@app.route("/api/messages", methods=["POST"])
def post_message():
    """Save a new message and return it."""
    data = request.get_json(silent=True) or {}

    client_id = str(data.get("client_id", "")).strip()
    author = str(data.get("author", "")).strip() or "Anonymous"
    body = str(data.get("body", "")).strip()

    if not body:
        return jsonify({"error": "Message cannot be empty."}), 400

    created_at = datetime.now(timezone.utc).isoformat()

    db = get_db()
    cursor = db.execute(
        "INSERT INTO messages (client_id, author, body, created_at) "
        "VALUES (?, ?, ?, ?)",
        (client_id, author, body, created_at),
    )
    db.commit()

    message = {
        "id": cursor.lastrowid,
        "client_id": client_id,
        "author": author,
        "body": body,
        "created_at": created_at,
    }
    return jsonify({"message": message}), 201


# Initialise the database when the module is imported so the app is ready to
# serve immediately. This is simple, though it makes automated tests slightly
# more awkward (see TODO.md).
init_db()


if __name__ == "__main__":
    print(f"Local Web Messenger starting on http://{HOST}:{PORT}")
    print("Open this on another computer using this machine's network IP.")
    app.run(host=HOST, port=PORT)
