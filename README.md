# Tunease — Modern Lossless Music Streaming Platform

Tunease is an audiophile-grade music streaming platform featuring a unified **Next.js 15 (App Router) + TypeScript** web application and a suite of high-performance **TypeScript microservices** connected via MongoDB, Redis, RabbitMQ, ImageKit, and Socket.IO real-time websockets.

---

## 🏛 Architecture Overview

```
                      ┌───────────────────────────────────────┐
                      │          Tunease Web App              │
                      │  (Next.js 15 + React 19 + TypeScript) │
                      │  - Audiophile Lossless Player Engine  │
                      │  - Marketing & Creator Showcase Pages │
                      │  - Full Authentication & Profile Hub  │
                      └──────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┼────────────────────────┐
                 │ HTTP / REST           │ HTTP / REST & WebSockets│
                 ▼                       ▼                        ▼
       ┌──────────────────┐    ┌──────────────────┐    ┌────────────────────┐
       │   Auth Service   │    │  Music Service   │    │Notification Service│
       │   (TypeScript)   │    │   (TypeScript)   │    │    (TypeScript)    │
       │    Port: 3000    │    │    Port: 3002    │    │     Port: 3001     │
       └─────────┬────────┘    └─────────┬────────┘    └──────────┬─────────┘
                 │                       │                        │
                 │ RabbitMQ: user_created│ RabbitMQ: verify_email │
                 └───────────────────────┼────────────────────────┘
                                         ▼
                            ┌────────────────────────┐
                            │ RabbitMQ / Redis Cluster│
                            └────────────────────────┘
```

---

## 📁 Project Structure

| Directory | Type | Stack | Port | Description |
| :--- | :--- | :--- | :---: | :--- |
| [`web/`](file:///web/) | Unified Web App | Next.js 15, React 19, TypeScript, Tailwind CSS | 3005 | Unified web application with App Router, Lossless Audio Player, dynamic lyrics, audio spectrum analyzer, queue manager, and creators portal. |
| [`Auth/Backend/`](file:///Auth/Backend/) | Microservice | Express, TypeScript, Mongoose, Redis, RabbitMQ | 3000 | User registration, login, JWT refresh/access token rotation, session invalidation, Google OAuth 2.0, OTP verification. |
| [`music/Backend/`](file:///music/Backend/) | Microservice | Express, TypeScript, Mongoose, Socket.IO, ImageKit | 3002 | Audio stream delivery, playlist management, Spotify catalog metadata sync, multi-user websocket playback sync, lossless media storage. |
| [`notification/Backend/`](file:///notification/Backend/) | Worker | Node.js, TypeScript, RabbitMQ, Nodemailer | 3001 | Background queue worker consuming `verify_email`, `verify_mobileNo`, and welcome email triggers. |

*(Legacy standalone Vite frontends in `landing/`, `Auth/Frontend/`, and `music/Frontend/` remain archived for standalone legacy testing).*

---

## ⚙️ Prerequisites & Environment Variables

- **Node.js** v20+ and **npm**
- **MongoDB** (Database instance)
- **Redis** (Session store & high-speed caching)
- **RabbitMQ** (Distributed message queue for auth/notification events)
- **ImageKit** (Lossless audio & cover artwork cloud storage)
- **Spotify API** (Catalogue and playlist search integration)

### Configuration

Copy `.env.example` to `.env` in each respective service directory:

1. `web/.env.example` ➔ `web/.env.local`
   - `NEXT_PUBLIC_API_URL=http://localhost:3000`
   - `NEXT_PUBLIC_MUSIC_API_URL=http://localhost:3002`
2. `Auth/Backend/.env.example` ➔ `Auth/Backend/.env`
   - `MONGO_URI`, `JWT_ACCESS_TOKEN_SECRET_KEY`, `JWT_REFRESH_TOKEN_SECRET_KEY`, `RABBIT_MQ_URL`, `REDIS_URL`
3. `music/Backend/.env.example` ➔ `music/Backend/.env`
   - `MONGO_URI`, `JWT_ACCESS_TOKEN_SECRET_KEY`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`
4. `notification/Backend/.env.example` ➔ `notification/Backend/.env`
   - `RABBIT_MQ_URL`, `EMAIL_USER`, `EMAIL_PASS`

---

## 🚀 Workspace Commands

From the repository root:

### Development
```bash
# Unified Next.js web application
npm run dev:web

# Microservices
npm run dev:auth          # Starts Auth backend in watch mode
npm run dev:music         # Starts Music backend in watch mode
npm run dev:notification  # Starts Notification worker in watch mode
```

### Production Build
```bash
# Build all TypeScript microservices and the Next.js app
npm run build:all

# Or build individually
npm run build:web
npm run build:auth
npm run build:music
npm run build:notification
```

### Running Test Suites
```bash
# Run all Jest test suites across all services (54 tests total)
npm run test:all

# Or test individually
npm run test:auth         # 7 suites, 32 tests passing
npm run test:music        # 3 suites, 15 tests passing
npm run test:notification # 1 suite, 5 tests passing
```

---

## 🎧 Unified Next.js Web Application Features

The unified Next.js application in `web/` integrates the complete Tunease ecosystem into a cohesive experience:

- **Marketing & Creator Showcase:**
  - Dynamic interactive landing page (`/`)
  - Audiophile technology breakdown (`/experience`)
  - Hi-Fi master studio difference (`/difference`)
  - Creator tools & royalty transparency (`/creators`)
  - Exclusive access waitlist modal (`/waitlist`)
- **Authentication & User Profiles:**
  - Login (`/login`) & Registration (`/register`) with real-time field validation
  - Profile hub with listening history & account management (`/profile`, `/me`)
- **Audiophile Player Experience:**
  - Lossless Audio Streaming Player with persistent playback across page transitions
  - Queue management, repeat/shuffle modes, volume controls
  - Dynamic lyrics modal and audio spectrum visualizer
  - Explore categories (`/explore`), personalized library (`/library`), playlists (`/playlist/[id]`), and artist views (`/artist/[id]`)
  - Creator music upload studio modal with drag-and-drop FLAC/WAV/MP3 upload
