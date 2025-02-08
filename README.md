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

### Owner Profiles

| Method | Endpoint                 | Description    | Auth |
| ------ | ------------------------ | -------------- | ---- |
| GET    | `/api/owner-profiles/me` | Get my profile | Yes  |
| POST   | `/api/owner-profiles/me` | Create profile | Yes  |
| PATCH  | `/api/owner-profiles/me` | Update profile | Yes  |

### Vet Profiles

| Method | Endpoint               | Description    | Auth |
| ------ | ---------------------- | -------------- | ---- |
| GET    | `/api/vet-profiles`    | List all vets  | No   |
| GET    | `/api/vet-profiles/me` | Get my profile | Yes  |
| POST   | `/api/vet-profiles/me` | Create profile | Yes  |
| PATCH  | `/api/vet-profiles/me` | Update profile | Yes  |

### Pets (Owners only)

| Method | Endpoint        | Description    | Auth |
| ------ | --------------- | -------------- | ---- |
| GET    | `/api/pets`     | List my pets   | Yes  |
| POST   | `/api/pets`     | Add new pet    | Yes  |
| GET    | `/api/pets/:id` | Get pet detail | Yes  |
| PATCH  | `/api/pets/:id` | Update pet     | Yes  |
| DELETE | `/api/pets/:id` | Remove pet     | Yes  |

### Schedules (Vets)

| Method | Endpoint             | Description            | Auth |
| ------ | -------------------- | ---------------------- | ---- |
| POST   | `/api/schedules`     | Set schedule for a day | Vet  |
| GET    | `/api/schedules/me`  | Get my weekly schedule | Vet  |
| PATCH  | `/api/schedules/:id` | Update day's schedule  | Vet  |
| DELETE | `/api/schedules/:id` | Remove from schedule   | Vet  |

### Schedules (Public)

| Method | Endpoint                          | Description         | Auth |
| ------ | --------------------------------- | ------------------- | ---- |
| GET    | `/api/schedules/vet/:vetId`       | Get vet's schedule  | No   |
| GET    | `/api/schedules/vet/:vetId/slots` | Get available slots | No   |

### Appointments (Owners)

| Method | Endpoint                | Description            | Auth  |
| ------ | ----------------------- | ---------------------- | ----- |
| POST   | `/api/appointments`     | Book new appointment   | Owner |
| GET    | `/api/appointments`     | List my appointments   | Owner |
| GET    | `/api/appointments/:id` | Get appointment detail | Owner |
| PATCH  | `/api/appointments/:id` | Update appointment     | Owner |
| DELETE | `/api/appointments/:id` | Cancel appointment     | Owner |

### Appointments (Vets)

| Method | Endpoint                       | Description          | Auth |
| ------ | ------------------------------ | -------------------- | ---- |
| GET    | `/api/appointments`            | List my appointments | Vet  |
| GET    | `/api/appointments/:id`        | Get appointment      | Vet  |
| PATCH  | `/api/appointments/:id/status` | Update status        | Vet  |

---

**Register/Login Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "owner" // optional: owner, vet, admin
}
```

**Auth Response:**

```json
{
  "access_token": "eyJhbG..."
}
```

**Create Profile Request:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890" // optional
  // For vets, also include:
  // "licenseNumber": "VET12345",
  // "specialization": "Surgery"
}
```

**Create Pet Request:**

```json
{
  "name": "Buddy",
  "species": "dog", // dog, cat, bird, rabbit, other
  "breed": "Golden Retriever", // optional
  "birthDate": "2020-05-15", // optional
  "weight": 25.5, // optional, in kg
  "notes": "Allergic to chicken" // optional
}
```

**Create Schedule Request (Vet):**

```json
{
  "dayOfWeek": 1, // 0=Sunday, 1=Monday, ..., 6=Saturday
  "startTime": "09:00",
  "endTime": "17:00",
  "slotDuration": 30 // optional, default 30 minutes
}
```

**Get Available Slots:**

```
GET /api/schedules/vet/:vetId/slots?date=2025-01-27
```

Response:

```json
{
  "date": "2025-01-27",
  "slots": [
    { "startTime": "09:00", "endTime": "09:30", "available": true },
    { "startTime": "09:30", "endTime": "10:00", "available": true }
  ]
}
```

**Create Appointment Request (Owner):**

First-time user (creates profile and pet inline):

```json
{
  "ownerFirstName": "John",
  "ownerLastName": "Doe",
  "ownerPhone": "+1234567890",
  "petName": "Buddy",
  "petSpecies": "dog",
  "petBreed": "Golden Retriever",
  "vetId": "uuid-of-vet",
  "date": "2025-01-27",
  "startTime": "09:00",
  "reason": "Annual checkup"
}
```

Returning user (existing pet):

```json
{
  "petId": "uuid-of-existing-pet",
  "vetId": "uuid-of-vet",
  "date": "2025-01-27",
  "startTime": "09:00",
  "reason": "Follow-up",
  "notes": "Please check ears"
}
```

**Update Status Request (Vet):**

```json
{
  "status": "confirmed" // pending, confirmed, cancelled, completed
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
