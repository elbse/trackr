# Trackr

A terminal-themed OJT (On-the-Job Training) application tracker built with the MERN stack.

🔗 **Live demo:** [trackr-psi-gold.vercel.app](https://trackr-psi-gold.vercel.app/)

> ⚠️ This is a learning project. I'm still getting started with full stack development — this was built step by step with AI guidance to help me understand how MongoDB, Express, React, and Node.js work together. Not a full production build, but a real working app that I'm proud of.

---

## What this is

Trackr helps you log and monitor your OJT application progress — companies, roles, statuses, and dates — all in one place. The UI is inspired by terminal/CLI aesthetics.

I built this to get a hands-on foundation in the MERN stack. Every file was written line by line with explanations, so I understand what each part does and why.

---

## What I learned building this

**Backend**
- Setting up an Express server with middleware
- Connecting to MongoDB Atlas using Mongoose
- Designing schemas and data models
- Building REST API endpoints (GET, POST, PUT, DELETE)
- Hashing passwords with bcrypt
- JWT-based authentication
- Protecting routes with custom middleware
- Testing endpoints with Thunder Client

**Frontend**
- Scaffolding a React app with Vite
- Managing global auth state with Context API
- Making HTTP requests with axios
- Controlled forms with useState
- Fetching data on mount with useEffect
- Conditional rendering for auth flow

**Dev workflow**
- Conventional commits (`feat:`, `chore:`, `fix:`)
- ESLint + Prettier setup
- Environment variables with `.env`
- Running client and server simultaneously

---

## Tech stack

| Layer | Technology |
|---|---|
| Database | MongoDB Atlas |
| Backend | Node.js, Express |
| Auth | JWT, bcryptjs |
| Frontend | React, Vite |
| HTTP client | Axios |
| Styling | Inline styles, JetBrains Mono |
| Deployment | Vercel (frontend) |

---

## Features

- Register and login with JWT authentication
- Add, update, and delete OJT applications
- Change application status (applied, interview, pending, offer, rejected)
- Filter applications by status
- Live stats bar (total, applied, interview, offer)
- Terminal dark UI aesthetic
- Data persists in MongoDB Atlas

---

## Project structure

```
trackr/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── api/            # axios calls to backend
│       ├── context/        # AuthContext (global auth state)
│       └── pages/          # Login, Register, Dashboard
└── server/                 # Express + Node backend
    ├── config/             # MongoDB connection
    ├── controllers/        # route logic
    ├── middleware/         # JWT protect middleware
    ├── models/             # Mongoose schemas
    └── routes/             # API route definitions
```

---

## Running locally

**Backend**
```bash
cd server
npm install
npm run dev
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

Make sure to create a `server/.env` file:
```
MONGO_URI=your_mongodb_atlas_uri
PORT=5000
JWT_SECRET=your_jwt_secret
```

---

## Status

Working but not fully polished. Planned improvements when I level up:

- [x] Deploy frontend to Vercel
- [ ] Deploy backend to Render
- [ ] Add React Router for proper navigation
- [ ] Notes/detail view per application
- [ ] Mobile responsive layout

---

*Built by Elbse — still learning, but getting there. 🚀*
