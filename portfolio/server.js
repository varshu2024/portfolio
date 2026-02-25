/**
 * ============================================================
 *   server.js  —  Varshini Uppada Portfolio Backend
 *   Express.js server with:
 *     • Static file serving
 *     • POST /api/contact  (contact form + optional email)
 *     • GET  /api/github   (GitHub profile & repo stats proxy)
 *     • GET  /api/visitors (Server-Sent Events: live visitor count)
 *     • GET  /api/stats    (combined portfolio stats JSON)
 * ============================================================
 */

"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// ── Optional: load .env if exists ──────────────────────────
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, "utf8").split("\n").forEach(line => {
        const [k, ...v] = line.split("=");
        if (k && !k.startsWith("#")) process.env[k.trim()] = v.join("=").trim();
    });
}

const PORT = process.env.PORT || 3000;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "varshu2024";

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));   // serve index.html, style.css, main.js, avatar.png

// ── In-memory stores ─────────────────────────────────────────
const messages = [];          // contact form submissions
let visitorCount = 0;
const sseClients = new Set();   // SSE connections

// ════════════════════════════════════════════════════════════
//  POST /api/contact
//  Receives { name, email, subject, message }
//  Saves to messages[], optionally sends email via nodemailer
// ════════════════════════════════════════════════════════════
app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ ok: false, error: "All fields are required." });
    }

    const entry = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    };

    messages.push(entry);
    console.log(`📨 New message from ${entry.name} (${entry.email}): ${entry.subject}`);

    // ── Optional email via nodemailer ─────────────────────────
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
            const nodemailer = require("nodemailer");
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            });
            await transporter.sendMail({
                from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
                to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
                subject: `[Portfolio] ${entry.subject}`,
                html: `
          <h2>New message from your portfolio</h2>
          <p><b>Name:</b> ${entry.name}</p>
          <p><b>Email:</b> ${entry.email}</p>
          <p><b>Subject:</b> ${entry.subject}</p>
          <p><b>Message:</b><br>${entry.message.replace(/\n/g, "<br>")}</p>
          <small>Sent at ${entry.timestamp}</small>
        `,
            });
            console.log("✉️  Email notification sent.");
        } catch (err) {
            console.warn("⚠️  Email failed (check SMTP config):", err.message);
        }
    }

    return res.json({ ok: true, message: "Message received! I'll get back to you soon." });
});

// ════════════════════════════════════════════════════════════
//  GET /api/github
//  Proxies GitHub public API for user profile + top repos
// ════════════════════════════════════════════════════════════
app.get("/api/github", async (req, res) => {
    try {
        // Use built-in https instead of node-fetch for no-dep simplicity
        const https = require("https");

        const fetchJSON = (url) => new Promise((resolve, reject) => {
            const opts = new URL(url);
            https.get({
                hostname: opts.hostname, path: opts.pathname + opts.search,
                headers: { "User-Agent": "portfolio-backend", "Accept": "application/vnd.github.v3+json" }
            }, res2 => {
                let data = "";
                res2.on("data", d => data += d);
                res2.on("end", () => resolve(JSON.parse(data)));
            }).on("error", reject);
        });

        const [user, repos] = await Promise.all([
            fetchJSON(`https://api.github.com/users/${GITHUB_USERNAME}`),
            fetchJSON(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=6&sort=updated`),
        ]);

        const topRepos = repos
            .filter(r => !r.fork)
            .slice(0, 6)
            .map(r => ({
                name: r.name,
                description: r.description,
                url: r.html_url,
                stars: r.stargazers_count,
                forks: r.forks_count,
                language: r.language,
                updated_at: r.updated_at,
            }));

        return res.json({
            ok: true,
            user: {
                login: user.login,
                name: user.name,
                bio: user.bio,
                followers: user.followers,
                following: user.following,
                public_repos: user.public_repos,
                avatar_url: user.avatar_url,
                html_url: user.html_url,
            },
            repos: topRepos,
        });
    } catch (err) {
        console.error("GitHub API error:", err.message);
        return res.status(502).json({ ok: false, error: "GitHub API unavailable." });
    }
});

// ════════════════════════════════════════════════════════════
//  GET /api/stats
//  Returns combined portfolio stats (used by the frontend)
// ════════════════════════════════════════════════════════════
app.get("/api/stats", (req, res) => {
    res.json({
        ok: true,
        stats: {
            problems_solved: 300,
            apis_built: 10,
            internships: 3,
            certifications: 9,
            projects: 3,
            visitors: visitorCount,
            messages_received: messages.length,
        },
    });
});

// ════════════════════════════════════════════════════════════
//  GET /api/visitors
//  Server-Sent Events: pushes live visitor count to all clients
// ════════════════════════════════════════════════════════════
app.get("/api/visitors", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Register this SSE client
    visitorCount++;
    sseClients.add(res);
    broadcastVisitors();

    // Send heartbeat every 25s to keep connection alive
    const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 25_000);

    req.on("close", () => {
        clearInterval(heartbeat);
        sseClients.delete(res);
        visitorCount = Math.max(0, visitorCount - 1);
        broadcastVisitors();
    });
});

function broadcastVisitors() {
    const data = JSON.stringify({ count: visitorCount });
    sseClients.forEach(client => client.write(`data: ${data}\n\n`));
}

// ════════════════════════════════════════════════════════════
//  Catch-all → serve index.html (SPA fallback)
// ════════════════════════════════════════════════════════════
app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ── Export for Vercel ───────────────────────────────────────
module.exports = app;
