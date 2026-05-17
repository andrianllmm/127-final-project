<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![License][license-shield]][license-url]

# MiaGo

Community-Based Food Delivery Platform for Miagao and UPV Miagao Campus

---

## About The Project

MiaGo is a community-based food delivery platform for Miagao municipality and UPV Miagao campus that connects customers with freelance riders for food pickup and delivery from local vendors through a centralized order and dispatch system.

It replaces fragmented Messenger/Facebook-based ordering workflows with a structured gig-based delivery marketplace where customers create delivery requests, riders accept jobs, and vendors serve as pickup points.

### Key Features

- Customer, vendor, and rider role-based system
- Food ordering via centralized delivery requests
- Deliveries job marketplace (browse and accept deliveries)
- Vendor item listings and order preparation workflow
- Order lifecycle tracking (request → accepted → picked up → delivered)
- Structured dispatch system replacing informal coordination

---

## Tech Stack

- TypeScript
- pnpm
- Turborepo
- React (Vite)
- Express.js
- Tailwind CSS + shadcn/ui
- Zod
- Better Auth
- PostgreSQL + Slonik + dbmate

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

```sh
git clone https://github.com/github_username/mia-go.git
cd mia-go
pnpm install
```

### Environment Setup

Create `.env` files for frontend and backend using provided templates.

```sh
cp .env.example .env
```

### Database Setup

This project requires a local PostgreSQL database.

#### Install PostgreSQL

**Linux / WSL**:

```sh
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

Create database:

```sh
sudo -u postgres createdb miago
```

**Windows**:

- Install PostgreSQL from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- Ensure `psql` is added to PATH

Create database:

```sh
createdb -U postgres miago
```

#### Run migrations

```sh
pnpm db:migrate
```

### Run Development Server

```sh
pnpm dev
```

---

## Project Structure

```
apps/
├── web/                         # React (Vite) frontend
│   └── src/
│       ├── features/            # feature modules
│       ├── layouts/             # page wrappers
│       ├── pages/               # general pages
│       ├── shared/              # reusable components/hooks/utils
│       ├── router.tsx           # route config
│       ├── main.tsx             # entry point
│       └── App.tsx              # root component
│
├── api/                         # Express backend
│   └── src/
│       ├── modules/             # feature modules
│       ├── db/                  # database client
│       ├── common/              # shared backend utilities
│       ├── config/              # environment & app config
│       ├── app.ts               # express app setup
│       └── server.ts            # server bootstrap
│
packages/                        # shared across apps
```

---

## Contributing

Contributions are welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

---

<!-- MARKDOWN LINKS -->

[contributors-shield]: https://img.shields.io/github/contributors/andrianllmm/127-final-project.svg?style=flat-square&color=FACC15
[contributors-url]: https://github.com/andrianllmm/127-final-project/graphs/contributors
[stars-shield]: https://img.shields.io/github/stars/andrianllmm/127-final-project.svg?style=flat-square&color=FACC15
[stars-url]: https://github.com/andrianllmm/127-final-project/stargazers
[license-shield]: https://img.shields.io/github/license/andrianllmm/127-final-project.svg?style=flat-square&color=FACC15
[license-url]: https://github.com/andrianllmm/127-final-project/blob/master/LICENSE.txt
