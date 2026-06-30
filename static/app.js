// Local Web Messenger - browser client.
// Talks to the Flask backend with plain fetch() and refreshes every second.

(function () {
    "use strict";

    // --- Identity stored in this browser only ------------------------------
    function getClientId() {
        let id = localStorage.getItem("lwm_client_id");
        if (!id) {
            id = "c-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
            localStorage.setItem("lwm_client_id", id);
        }
        return id;
    }

    const clientId = getClientId();

    const messagesEl = document.getElementById("messages");
    const form = document.getElementById("send-form");
    const messageInput = document.getElementById("message-input");
    const nameInput = document.getElementById("name-input");
    const statusDot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");

    let lastSeenId = 0;

    // Restore saved display name.
    nameInput.value = localStorage.getItem("lwm_name") || "";
    nameInput.addEventListener("input", function () {
        localStorage.setItem("lwm_name", nameInput.value.trim());
    });

    // --- Helpers -----------------------------------------------------------
    function setStatus(online) {
        statusDot.classList.toggle("online", online);
        statusDot.classList.toggle("offline", !online);
        statusText.textContent = online ? "Connected" : "Offline - retrying…";
    }

    function formatTime(iso) {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    function nearBottom() {
        const gap = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight;
        return gap < 80;
    }

    function addMessage(msg) {
        const bubble = document.createElement("div");
        bubble.className = "bubble" + (msg.client_id === clientId ? " mine" : "");

        const meta = document.createElement("span");
        meta.className = "meta";
        meta.textContent = (msg.author || "Anonymous") + " · " + formatTime(msg.created_at);

        const text = document.createElement("span");
        text.textContent = msg.body;

        bubble.appendChild(meta);
        bubble.appendChild(text);
        messagesEl.appendChild(bubble);
    }

    // --- Loading messages (polling) ----------------------------------------
    async function loadMessages() {
        try {
            const res = await fetch("/api/messages?after_id=" + lastSeenId);
            if (!res.ok) throw new Error("bad response");
            const data = await res.json();
            setStatus(true);

            const newMessages = data.messages || [];
            if (newMessages.length === 0) return;

            const stick = nearBottom();
            newMessages.forEach(function (msg) {
                addMessage(msg);
                if (msg.id > lastSeenId) lastSeenId = msg.id;
            });

            // Keep view pinned to the newest message only if the reader was
            // already near the bottom; otherwise preserve their scroll spot.
            if (stick) messagesEl.scrollTop = messagesEl.scrollHeight;
        } catch (err) {
            setStatus(false);
        }
    }

    // --- Sending messages --------------------------------------------------
    async function sendMessage() {
        const body = messageInput.value.trim();
        if (!body) return; // prevent empty messages

        const author = nameInput.value.trim() || "Anonymous";

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ client_id: clientId, author: author, body: body }),
            });
            if (!res.ok) throw new Error("send failed");
            messageInput.value = "";
            messageInput.focus();
            await loadMessages(); // show it right away
        } catch (err) {
            setStatus(false);
            alert("Could not send the message. Check that the app is still running.");
        }
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        sendMessage();
    });

    // Enter to send (the form submit already handles this; kept explicit for
    // clarity that Enter sends and Shift is not needed in a single-line input).
    messageInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    // --- Start -------------------------------------------------------------
    loadMessages();
    setInterval(loadMessages, 1000);
})();
