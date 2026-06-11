# Connectify

Connectify is a social feed application where users can register, sign in, browse a timeline, create posts (with optional images), comment and reply, and like content at every level.

## Tech Stack

| Layer    | Stack                                      |
| -------- | ------------------------------------------ |
| Frontend | React 19, Vite, React Router               |
| Backend  | Node.js, Express 5                         |
| Database | Microsoft SQL Server (`mssql`)             |
| Auth     | JWT (bcrypt password hashing)              |
| Uploads  | Multer (local disk, served from `/uploads`) |

## Features

- **Authentication** — Register, login, logout, and session restore via JWT
- **Feed** — Public posts plus the current user's private posts, newest first
- **Posts** — Text, optional image, public/private visibility
- **Comments & replies** — Threaded discussion on posts
- **Likes** — Toggle likes on posts, comments, and replies
- **Who liked this** — Modal with paginated liker list
- **Responsive UI** — Desktop header and mobile navigation with scroll-to-top on Home/logo

## Project Structure

```
Connectify/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Feed UI, route guards
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Feed, Login, Register
│   │   ├── routes/         # App routing
│   │   └── services/       # API client
│   └── vite.config.js      # Proxies /api and /uploads to the server
├── server/                 # Express API
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   ├── validators/
│   ├── database/           # SQL schema scripts
│   └── uploads/            # Post images (created at runtime)
└── package.json            # Root scripts to run client + server together
```

## Prerequisites

- Node.js 18+
- SQL Server (local or remote)
- npm

## Getting Started

### 1. Install dependencies

From the project root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 2. Configure the database

Create a database (default name: `social_app`), then run the schema scripts in order:

```bash
# Against your SQL Server instance
server/database/schema.sql
server/database/feedSchema.sql
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp server/.env.example server/.env
```

| Variable                    | Description                          |
| --------------------------- | ------------------------------------ |
| `PORT`                      | API port (default `5000`)            |
| `DB_USER` / `DB_PASSWORD`   | SQL Server credentials               |
| `DB_SERVER` / `DB_PORT`     | SQL Server host and port             |
| `DB_NAME`                   | Database name                        |
| `JWT_SECRET`                | Secret for signing tokens            |
| `JWT_EXPIRES_IN`            | Token lifetime (default `7d`)        |

### 4. Run the app

**Development (client + server):**

```bash
npm run dev
```

Or run them separately:

```bash
npm run server   # API on http://localhost:5000
npm run client   # Vite dev server (proxies API requests)
```

The Vite dev server proxies `/api` and `/uploads` to the backend, so no extra client env is required for local development.

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start client and server        |
| `npm run client`  | Start Vite dev server only     |
| `npm run server`  | Start API with nodemon         |

## API Overview

All feed and like routes require a valid `Authorization: Bearer <token>` header.

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| POST   | `/api/auth/register`          | Create account           |
| POST   | `/api/auth/login`             | Sign in                  |
| GET    | `/api/auth/me`                | Current user             |
| GET    | `/api/posts/feed`             | Timeline                 |
| POST   | `/api/posts`                  | Create post (multipart)  |
| DELETE | `/api/posts/:id`              | Delete own post          |
| GET    | `/api/posts/:id/comments`     | List comments            |
| POST   | `/api/posts/:id/comments`     | Add comment              |
| GET    | `/api/comments/:id/replies`   | List replies             |
| POST   | `/api/comments/:id/replies`   | Add reply                |
| POST   | `/api/likes/toggle`           | Toggle like              |
| GET    | `/api/likes`                  | Like status for a target |
| GET    | `/api/likes/likers`           | Paginated liker list     |

## Architecture Notes

**Backend layering** — Routes validate input, controllers handle HTTP, services contain business logic, and SQL queries live in services.

**Polymorphic likes** — A single `likes` table stores likes for posts, comments, and replies using `target_type` and `target_id`, with a unique constraint per user per target.

**Feed performance** — Like counts, `isLiked`, and a preview of recent likers are batch-loaded when fetching posts to avoid N+1 queries.

**Auth tokens** — JWTs are stored in `sessionStorage` on the client and cleared on logout.

**Post visibility** — Public posts appear in everyone's feed; private posts are visible only to their author.

## Database Tables

- `users` — Accounts
- `posts` — Feed items (text, image, visibility)
- `comments` — Comments on posts
- `replies` — Replies on comments
- `likes` — User likes on posts, comments, or replies

## Out of Scope (template placeholders)

Friend requests, chat, notifications, video/event/article post types, user profiles, and feed pagination are not yet implemented. Sidebars and some nav links use static template content.
