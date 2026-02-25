# Varshini Uppada | AI/ML & Backend Engineer Portfolio

A premium, interactive, and high-performance developer portfolio showcasing expertise in **AI/ML Engineering**, **Scalable Backend Systems**, and **Cloud Architectures**.

![Portfolio Preview Showcase](https://img.shields.io/badge/Focus-AI%2FML%20Engineering-6c63ff?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Three.js%20%7C%20Express-blueviolet?style=for-the-badge)

## 🚀 Key Features

### 🧠 3D Neural Network Visualization
An interactive background built with **Three.js** that represents a neural network. It features 80 dynamic nodes with mouse-responsive parallax effects and shimmering SVG-like connections.

### 🤖 AI/ML Engineering Focus
Tailored content highlighting deep expertise in:
- **LLM Pipelines** (LangChain, OpenAI API)
- **Natural Language Processing** (NLP)
- **Computer Vision** (OpenCV, PyTorch)
- **Neural Networks** (TensorFlow)

### ⚡ Powered Backend (Express.js)
A robust backend server serving:
- **POST /api/contact**: Real-time form submission with optional email notifications (Nodemailer).
- **GET /api/visitors**: Live visitor counter implemented via **Server-Sent Events (SSE)**.
- **GET /api/github**: Proxy for GitHub API to display dynamic repository stats without exposing client-side keys.

### 🎨 Premium UI/UX
- **Magnetic Interaction**: Buttons and cards that subtly follow the cursor.
- **Glassmorphism**: Modern frosted-glass navbars and cards.
- **Staggered Animations**: Smooth intersection-observer reveals for sections and items.
- **Liquid Typography**: Variable-width headlines and custom cursors.

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Vanilla JS, Three.js, Modern CSS3 |
| **Backend** | Node.js, Express.js |
| **Integrations** | GitHub API, Nodemailer, SSE |
| **Deployment** | Vercel (Serverless Functions) |

## 📦 Setup & Installation

### 1. Prerequisites
- Node.js (v14+)
- npm or yarn

### 2. Clone and Install
```bash
git clone https://github.com/varshu2024/portfolio.git
cd portfolio
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
GITHUB_USERNAME=varshu2024
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NOTIFY_EMAIL=receiving-email@gmail.com
```

### 4. Running Locally
```bash
npm start
```

## ☁️ Deployment (Vercel)
This project is configured for Vercel Serverless Functions.
```bash
npx vercel
```

## 👩‍💻 About Varshini
B.Tech student in Electronics & Communication Engineering. Bridging the gap between AI/ML and scalable production systems.

---
*Designed & Built with ❤️ by Varshini Uppada*
