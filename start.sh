#!/usr/bin/env bash
# start.sh - the easy way to launch Local Web Messenger on Linux.
#
# What it does for you:
#   1. Creates a Python virtual environment the first time (.venv).
#   2. Installs Flask the first time.
#   3. Starts the chat app.
#   4. Prints the exact web address other computers should open.
#
# How to use it:
#   bash start.sh
#
# To stop the app later: press  Ctrl + C  in this window.

set -e

# Move into the folder this script lives in, so it works from anywhere.
cd "$(dirname "$0")"

# 1. Create the virtual environment the first time only.
if [ ! -d ".venv" ]; then
    echo "First run: setting up a private Python environment (.venv)…"
    python3 -m venv .venv
fi

# 2. Turn the environment on and make sure Flask is installed.
# shellcheck disable=SC1091
source .venv/bin/activate
pip install --quiet --requirement requirements.txt

# 3. Work out this machine's network address so you know what to open.
LAN_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
PORT="${PORT:-8080}"

echo
echo "============================================================"
echo " Local Web Messenger is starting."
echo
echo " On THIS computer, open:   http://localhost:${PORT}"
if [ -n "$LAN_IP" ]; then
    echo " On ANOTHER computer, open: http://${LAN_IP}:${PORT}"
fi
echo
echo " (If you use Tailscale, you can also use your Tailscale IP:"
echo "  run 'tailscale ip -4' to see it.)"
echo
echo " To stop the app: press Ctrl + C here."
echo "============================================================"
echo

# 4. Start the app.
python app.py
