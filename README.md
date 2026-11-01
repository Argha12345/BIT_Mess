# Hostel Mess Food-Traffic Optimization & Food Waste Reduction Analytics

A full-stack web application designed for Hostel Mess management, featuring live food-traffic optimization, food waste tracking, menu polls, feedback management, and user check-ins.

## 📁 Repository Structure

```
.
├── backend/       # Node.js + Express REST API backend
│   ├── data/      # JSON database files
│   └── src/       # Express routes, controllers, and models
├── frontend/      # React + Vite frontend application
│   ├── public/    # Static assets
│   └── src/       # Components, pages, styles, and utilities
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend server runs on `http://localhost:5000`.

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend development server runs on `http://localhost:5173`.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Recharts, CSS3 (Glassmorphism design)
- **Backend**: Node.js, Express.js, File-based JSON data stores

## Deploy the backend to Render

This repository includes a Render Blueprint in `render.yaml`. In Render, create a
Blueprint instance from this repository and deploy the `bit-mess-backend` web
service. The blueprint uses a paid Starter web service with a 1 GB persistent
disk because the backend stores mutable application records as JSON files. The
disk is mounted at `/var/data`; keep `DATA_DIR=/var/data` so records survive
restarts and deploys. A disk-backed service runs as one instance and has a brief
restart during deploys.

After the backend is live:

1. Copy its `https://...onrender.com` URL.
2. Set `CLIENT_ORIGIN` on the backend to the exact deployed frontend origin
   (scheme and host only, no trailing slash). Multiple origins can be separated
   with commas. Save the setting and redeploy.
3. Set `VITE_API_BASE_URL` in the frontend hosting provider to
   `https://...onrender.com/api`, then rebuild/redeploy the frontend.
4. Visit `https://...onrender.com/health`; it should return `{"status":"ok"}`.

The frontend can be deployed separately as a static site from `frontend` using
`npm ci` and `npm run build`, publishing `dist`. Configure its API URL before
building because Vite embeds `VITE_API_BASE_URL` in the generated assets.

For local development, optionally copy `backend/.env.example` to `backend/.env`
and `frontend/.env.example` to `frontend/.env`. Never commit real environment
files. Render generates `JWT_SECRET`; production startup fails if it is absent.
