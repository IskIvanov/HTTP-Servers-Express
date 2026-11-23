# Chirpy — HTTP Server in TypeScript

![Chirpy API demo: sign up, log in, post and list chirps with curl](docs/demo.gif)

A small Twitter-like REST API ("Chirpy") built from scratch with Express 5, PostgreSQL and Drizzle ORM, as part of the [Boot.dev](https://boot.dev) HTTP Servers course.

## Features

- User sign-up and login with Argon2 password hashing
- JWT creation and validation
- Chirps (posts, max 140 chars): create, list, get by ID
- Static file server with hit metrics and admin reset
- Centralized error handling and request logging middleware
- Database migrations with Drizzle Kit

## Stack

TypeScript · Express 5 · PostgreSQL · Drizzle ORM · Argon2 · jsonwebtoken · Vitest · Biome

## Getting started

Create a `.env` file:

```env
DB_URL=postgres://user:password@localhost:5432/chirpy?sslmode=disable
PLATFORM=dev
```

Install, migrate and run:

```bash
bun install
bun run migrate
bun run dev        # builds and starts on http://localhost:8080
bun run test       # runs the tests
```

### Changing the database schema

After editing `src/db/schema.ts`, generate a new migration and apply it:

```bash
bun run generate   # drizzle-kit generate → new SQL file in src/db/migrations
bun run migrate    # drizzle-kit migrate → applies it to the database
```

The server also applies any pending migrations automatically on startup.

## API

| Method | Path               | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | `/api/healthz`     | Readiness check                |
| POST   | `/api/users`       | Create a user                  |
| POST   | `/api/login`       | Log in                         |
| POST   | `/api/chirps`      | Create a chirp                 |
| GET    | `/api/chirps`      | List chirps                    |
| GET    | `/api/chirps/:id`  | Get a chirp by ID              |
| GET    | `/admin/metrics`   | File server hit count          |
| POST   | `/admin/reset`     | Reset metrics and data (dev)   |

## License

MIT
