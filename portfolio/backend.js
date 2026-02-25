/* =====================================================
   backend.js — Portfolio Backend Integration
   Connects frontend to Express.js server:
     • Contact form  → POST /api/contact
     • Visitor count → GET  /api/visitors (SSE)
     • GitHub widget → GET  /api/github
   ===================================================== */

"use strict";

/* ── Contact Form ────────────────────────────────────── */
function handleFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById("contactForm");
    const btn = document.getElementById("submitBtn");
    const text = document.getElementById("submitText");
    const icon = document.getElementById("submitIcon");
    const success = document.getElementById("formSuccess");

    btn.disabled = true;
    text.textContent = "Sending...";
    icon.textContent = "⏳";

    fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value,
        }),
    })
        .then(r => r.json())
        .finally(() => {
            text.textContent = "Sent!";
            icon.textContent = "✅";
            success.style.display = "block";
            form.reset();
            setTimeout(() => {
                btn.disabled = false;
                text.textContent = "Send Message";
                icon.textContent = "🚀";
                success.style.display = "none";
            }, 4000);
        });
}

/* ── Live Visitor Counter (SSE) ──────────────────────── */
(function () {
    const badge = document.getElementById("visitor-count");
    if (!badge || typeof EventSource === "undefined") return;
    try {
        const es = new EventSource("/api/visitors");
        es.onmessage = function (e) {
            try {
                var data = JSON.parse(e.data);
                badge.textContent = data.count;
                badge.classList.add("vc-updated");
                setTimeout(function () { badge.classList.remove("vc-updated"); }, 600);
            } catch (ex) { }
        };
        es.onerror = function () { es.close(); };
    } catch (ex) { }
})();

/* ── GitHub Stats Widget ─────────────────────────────── */
(function () {
    var widget = document.getElementById("github-stats-widget");
    if (!widget) return;

    fetch("/api/github")
        .then(function (r) { return r.json(); })
        .then(function (d) {
            if (!d.ok || !d.user) throw new Error("no data");
            var user = d.user;
            var repos = d.repos || [];

            var repoHTML = repos.map(function (r) {
                return '<a class="gh-repo-card" href="' + r.url + '" target="_blank" rel="noopener">' +
                    '<div class="gh-repo-name">' + r.name + '</div>' +
                    (r.description ? '<div class="gh-repo-desc">' + r.description + '</div>' : '') +
                    '<div class="gh-repo-meta">' +
                    (r.language ? '<span class="gh-lang">' + r.language + '</span>' : '') +
                    '<span>⭐ ' + r.stars + '</span>' +
                    '<span>🍴 ' + r.forks + '</span>' +
                    '</div>' +
                    '</a>';
            }).join("");

            widget.innerHTML =
                '<div class="gh-user-bar">' +
                '<img src="' + user.avatar_url + '" alt="' + (user.name || user.login) + '" class="gh-avatar"/>' +
                '<div>' +
                '<div class="gh-user-name">' + (user.name || user.login) + '</div>' +
                '<div class="gh-user-bio">' + (user.bio || '') + '</div>' +
                '<div class="gh-user-stats">' +
                '<span><strong>' + user.public_repos + '</strong> repos</span>' +
                '<span><strong>' + user.followers + '</strong> followers</span>' +
                '<span><strong>' + user.following + '</strong> following</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="gh-repos-grid">' + repoHTML + '</div>';

            widget.classList.add("loaded");
        })
        .catch(function () {
            var sec = widget.closest ? widget.closest(".github-section") : null;
            if (sec) sec.style.display = "none";
        });
})();
