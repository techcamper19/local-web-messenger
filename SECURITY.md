# Security & Privacy

This document describes the security posture of **Local Web Messenger**, its
known limitations, the risks of running it, and recommendations. It reflects an
audit performed before the repository was made public.

> **One-line summary:** This is a deliberately tiny chat app for a **trusted**
> home LAN or private Tailscale network. It has **no authentication and no
> encryption** and must **never** be exposed to the public internet.

## Reporting a vulnerability

This is a small hobby project with no security guarantees. If you find a
problem, please open a GitHub issue describing it. Do not include real secrets
or private data in the report.

## Current security posture

**What the app does and does not do, verified by reading the code:**

- ✅ **No external network calls.** The app never contacts the internet. The
  browser talks only to its own backend using same-origin relative URLs
  (`/api/messages`). There is no analytics, no telemetry, and no third-party
  service.
- ✅ **No third-party frontend assets.** All HTML, CSS, and JavaScript are served
  locally. Nothing is loaded from a CDN.
- ✅ **SQL injection safe.** All database access uses parameterised queries
  (`?` placeholders), never string concatenation.
- ✅ **Stored-XSS safe.** Messages are inserted into the page with
  `textContent`, never `innerHTML`, so message text cannot inject markup or
  scripts.
- ✅ **Debugger disabled.** The app runs `app.run()` without `debug=True`, so the
  interactive Werkzeug debugger (a remote code-execution risk) is never exposed.
- ✅ **Basic input validation.** Empty messages are rejected; sender names and
  message bodies are trimmed.
- ✅ **No secrets in the repository or git history.** No API keys, tokens,
  passwords, SSH keys, or `.env` files have ever been committed.

## Known limitations

These are intentional trade-offs for simplicity, not bugs:

- ❌ **No authentication.** Anyone who can reach the address can read and post
  messages. There are no accounts, passwords, or tokens.
- ❌ **No encryption (HTTP only).** Traffic is plain HTTP. On a shared network it
  can be observed. (Tailscale provides its own encryption between devices.)
- ❌ **Binds to all network interfaces.** The default `HOST` is `0.0.0.0`, so the
  app is reachable from every network the host machine is connected to, not just
  one. This is required so other devices can connect — see "Risks" below.
- ❌ **Development server.** It uses Flask's built-in server, which is not
  hardened for hostile or high-traffic use.
- ❌ **No rate limiting or message-size limit on the server.** The browser caps
  input length, but a client calling the API directly is not limited, so a
  malicious LAN client could spam or send very large messages.
- ❌ **No CSRF token.** Mitigated in practice because the API only accepts
  `application/json` and sets no permissive CORS headers, but any device already
  on the network can post directly.

## Risks

| Risk | Severity (trusted LAN) | Notes |
| ---- | ---------------------- | ----- |
| Anyone on the network can read/write messages | Medium | By design. Keep it on a trusted LAN/Tailscale only. |
| Exposed to the public internet (e.g. port-forwarding, hosting on a public VM) | **Critical** | No auth + no HTTPS = fully open chat. **Do not do this.** |
| Traffic sniffed on a shared/public Wi-Fi | Medium | HTTP is unencrypted. Prefer Tailscale or a private LAN. |
| Disk filled by a client posting huge/many messages | Low | No server-side size or rate limit. Trusted-LAN assumption. |
| `messages.db` leaked | Low–Medium | Holds your chat history. It is gitignored and must not be committed. |

## Privacy

- The app collects **no analytics** and contacts **no external services**.
- All data (messages, sender names) stays in a local SQLite file
  (`messages.db`) on the host machine. Sender names live in the browser's
  `localStorage` and are never sent anywhere except to your own backend.
- Note: the project `README.md` references status badges (shields.io) and a
  screenshot. Those load only when **viewing the README on GitHub**, in the
  viewer's browser — the application itself never loads them.

## Recommendations

For the current trusted-LAN use case, the app is acceptable as-is. To reduce
risk further, in rough priority order:

1. **Never expose it to the public internet.** No port-forwarding, no public
   hosting. Use Tailscale if you need remote access.
2. **Restrict the network surface.** If you do not need all interfaces, bind to a
   single one, e.g. `HOST=127.0.0.1` (same machine only) or your Tailscale IP.
   Use a firewall rule to limit who can reach port 8080.
3. **Add optional shared-password protection** before any wider exposure
   (already on the roadmap).
4. **Add a server-side message length cap** to prevent oversized payloads.
5. **Back up `messages.db`** if the history matters to you, and keep it out of
   git (it already is).
6. If you ever move beyond a trusted LAN, put it behind a real reverse proxy
   with HTTPS and authentication, and run it under a production WSGI server
   instead of the Flask development server.

## Files that must never be committed

These are covered by `.gitignore`. Verify they are not tracked before publishing:

- `messages.db` / any `*.db` (private chat history)
- `.venv/`, `__pycache__/`, `*.pyc`
- `.env`, `instance/`, `*.log`
- `last-ip.txt` (written by `open-chat.ps1`)

## Dependencies

The only direct dependency is **Flask**. Its standard transitive dependencies
(Werkzeug, Jinja2, Click, Blinker, ItsDangerous, MarkupSafe) are all maintained
by the Pallets project. There are no other runtime dependencies, which keeps the
supply-chain surface very small.
