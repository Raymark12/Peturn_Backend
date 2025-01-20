# Peturn

Backend API for veterinary appointment management built with NestJS.

## Tech Stack

- NestJS + TypeScript
- TypeORM + PostgreSQL
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 20.x
- PostgreSQL 16+

### Installation

```bash
npm install
cp .env.example .env  # Configure your database and JWT_SECRET
npm run start:dev
```

API available at `http://localhost:3000/api`

### Environment Variables

| Variable         | Description            | Default   |
| ---------------- | ---------------------- | --------- |
| `DB_HOST`        | Database host          | localhost |
| `DB_PORT`        | Database port          | 5432      |
| `DB_USERNAME`    | Database user          | postgres  |
| `DB_PASSWORD`    | Database password      | -         |
| `DB_DATABASE`    | Database name          | peturn    |
| `JWT_SECRET`     | Secret for JWT signing | -         |
| `JWT_EXPIRATION` | Token expiration       | 1d        |

## API Endpoints

### Auth

| Method | Endpoint             | Description       | Auth |
| ------ | -------------------- | ----------------- | ---- |
| POST   | `/api/auth/register` | Register new user | No   |
| POST   | `/api/auth/login`    | Login             | No   |
| GET    | `/api/auth/me`       | Get current user  | Yes  |

**Register/Login Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "owner" // optional: owner, vet, admin
}
```

**Response:**

```json
{
  "access_token": "eyJhbG..."
}
```

## Scripts

```bash
npm run start:dev   # Development
npm run build       # Build
npm run start:prod  # Production
npm run lint        # Lint
npm run test        # Test
```

## License

UNLICENSED
