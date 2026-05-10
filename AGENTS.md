# Agent Instructions

## Project

MiaGo is a community-based food delivery platform for Miagao municipality and UPV Miagao campus.

Stack: React (Vite), Express.js, PostgreSQL, Slonik, dbmate, Better Auth, Tailwind CSS, shadcn/ui, TypeScript, Turborepo.

---

## Repo Structure

```
apps/
  web/   # React (Vite) frontend
  api/   # Express backend
```

---

## Core Rules

- Modular monolith (domain-based modules)
- Keep frontend/backend fully independent (no cross-imports)

---

## Domain Features

- Auth
- Users (customers, riders, vendors)
- Stores
- Orders
- Riders

## Express Rules

- Feature-based folder structure
- Controllers are thin (request/response only)
- Services contain all business logic
- Repositories handle database access (Slonik)
- Zod validation required at boundaries

---

## React Rules

- Feature-based structure
- Use reusable shadcn/ui components
- Avoid coupling UI to API implementation details

---

## Code Style

- TypeScript strict mode
- Small domain-focused functions
- Prefer composition over inheritance
- Explicit over implicit logic
