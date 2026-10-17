# AthliX: AI Athlete Performance Tracker

AthliX is a full-stack athlete workout management system designed to help athletes organize their workouts, receive personalized exercise recommendations, manage their profiles, and track their workout progress through a single platform.

The project combines web development, database management, and machine learning concepts to make workout planning more personalized, structured, and accessible

## Features

- **Authentication**: sign up, log in and log out with bcrypt-hashed passwords and JWTs stored in an HTTP-only cookie.
- **3-step onboarding**: sport and competition level, body metrics and injury history, then workout preferences (equipment, workout types, target areas, difficulty and session duration).
- **Athlete profile**: view and edit profile details, goals and injury records.
- **Exercise recommendations**: a content-based recommender (Python / FastAPI) ranks exercises against the athlete's preferences and a free-text description.
- **Workout plans**: save recommended exercises as a plan with sets, reps, rest time and a schedule, and mark each exercise complete.
- **Progress analytics**: completion rate, pending vs. completed exercises and a 7-day activity chart.
- **Dashboard**: at-a-glance stats for workouts and exercises.

## Architecture

The project is split into three independent services:

```
Frontend  ───▶  Backend  ───▶  ML Service
(React)         (Express)      (FastAPI)
                   │
                   ▼
                 MySQL
```

| Folder        | Purpose                                          | Tech                                                                    |
| ------------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| `frontend/`   | User interface                                   | React 19, Vite, React Router 7, Tailwind CSS 4, Recharts, Axios, Lucide |
| `backend/`    | REST API, auth, persistence, proxy to ML service | Node.js, Express 5, Prisma 6, MySQL, JWT, bcrypt                        |
| `ml-service/` | Exercise recommendation engine                   | Python, FastAPI, scikit-learn, pandas, NumPy, SciPy, joblib             |

## How the recommender works

The recommender in `ml-service/recommender.py` loads pre-built artifacts from `ml-service/artifacts/` (an encoder, a TF-IDF vectorizer, and weighted feature matrices for the exercise catalogue) and scores every exercise against the athlete's request:

1. **Structured similarity**: the athlete's equipment, body part, target muscle, difficulty and category are one-hot encoded, weighted, and compared with every exercise using cosine similarity.
2. **Text similarity**: the free-text description is vectorized with TF-IDF and compared with the exercises' text features.
3. **Final score**: `0.70 × structured + 0.30 × text`.
4. **Constraints and ranking**:
   - Equipment is a **hard filter**. Exercises needing equipment the athlete didn't select are never returned.
   - Difficulty can fall back only to **easier** levels (Advanced → Intermediate → Beginner).
   - Results are sorted by difficulty fit, then body-part, target and category matches, then final score.
   - Exercises listed in `excluded_exercises` are removed.

## Getting started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- MySQL 8+

### 1. Clone

```bash
git clone https://github.com/srushti199/AI-Athelete-Performance-Tracker.git
cd AI-Athelete-Performance-Tracker
```

### 2. ML service

```bash
cd ml-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --port 8001 --reload
```

The service runs at `http://127.0.0.1:8001`. Check `GET /health`, and see the interactive docs at `/docs`.

### 3. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=4000
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/athlix"
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
ML_SERVICE_URL=http://127.0.0.1:8001
NODE_ENV=development
```

Set up the database and start the API:

```bash
npx prisma migrate deploy      # apply migrations
npx prisma generate            # generate the Prisma client
npx nodemon server.js          # or: node server.js
```

The API runs at `http://localhost:4000`.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

> The frontend calls the API at `http://localhost:4000/api` (`frontend/src/api/axios.js`), and the backend allows CORS only from `http://localhost:5173` (`backend/app.js`). Update those two values if you change ports or deploy.

## API reference

All routes are prefixed with `/api`. Routes marked 🔒 require the auth cookie set at login.

### Auth

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| POST   | `/auth/signup` | Create an account       |
| POST   | `/auth/login`  | Log in                  |
| POST   | `/auth/logout` | Log out (clears cookie) |

### Profile 🔒

| Method | Endpoint                      | Description               |
| ------ | ----------------------------- | ------------------------- |
| POST   | `/profile`                    | Onboarding step 1         |
| PATCH  | `/profile/onboardingStep2`    | Onboarding step 2         |
| PATCH  | `/profile/onboardingStep3`    | Onboarding step 3         |
| GET    | `/profile`                    | Get the athlete's profile |
| PATCH  | `/profile`                    | Update the profile        |
| DELETE | `/profile/injuries/:injuryId` | Delete an injury record   |

### Recommendations

| Method | Endpoint           | Description                                        |
| ------ | ------------------ | -------------------------------------------------- |
| POST   | `/recommendations` | Get ranked exercises (forwarded to the ML service) |

Example request body:

```json
{
  "equipment_options": ["body weight", "dumbbell"],
  "body_parts": ["upper legs"],
  "targets": ["quads"],
  "categories": ["strength"],
  "difficulty": "Beginner",
  "description": "beginner exercises to strengthen the quadriceps",
  "top_n": 10,
  "excluded_exercises": []
}
```

### Workout plans 🔒

| Method | Endpoint                                                | Description               |
| ------ | ------------------------------------------------------- | ------------------------- |
| POST   | `/workout-plans`                                        | Create a workout plan     |
| GET    | `/workout-plans`                                        | List the athlete's plans  |
| GET    | `/workout-plans/:id`                                    | Get one plan              |
| PATCH  | `/workout-plans/:planId/exercises/:exerciseId/complete` | Mark an exercise complete |

### Progress and dashboard 🔒

| Method | Endpoint     | Description                                 |
| ------ | ------------ | ------------------------------------------- |
| GET    | `/progress`  | Completion stats and 7-day activity         |
| GET    | `/dashboard` | Athlete summary and workout/exercise counts |

### ML service (direct)

| Method | Endpoint     | Description              |
| ------ | ------------ | ------------------------ |
| GET    | `/`          | Service status message   |
| GET    | `/health`    | Health check             |
| POST   | `/recommend` | Generate recommendations |

## Data model

Managed with Prisma (`backend/prisma/schema.prisma`) on MySQL:

- `User` has one `AthleteProfile` and many `WorkoutPlan`s
- `AthleteProfile` has `ProfileGoal`s, `Injury` records and one `WorkoutPreference`
- `WorkoutPreference` has `AthleteEquipment`, `AthleteWorkoutType` and `AthleteTargetArea` entries
- `WorkoutPlan` has many `WorkoutPlanExercise`s (sets, reps, rest, schedule, completion status)

## Project structure

```
.
├── backend/
│   ├── app.js, server.js
│   ├── prisma/                 # schema and migrations
│   └── src/
│       ├── controllers/        # auth, profile, onboarding, recommendations, plans, progress, dashboard
│       ├── middlewares/        # JWT auth guard
│       ├── routes/
│       └── utils/              # AppError, catchAsync, helpers
├── frontend/
│   └── src/
│       ├── api/                # Axios clients
│       ├── components/         # landing page, dashboard and form components
│       ├── pages/              # Landing, Login, Signup, Onboarding, Dashboard, Profile,
│       │                       # Recommendations, WorkoutPlan, Progress
│       ├── hooks/, utils/, constants/, services/
├── ml-service/
│   ├── main.py                 # FastAPI app
│   ├── recommender.py          # recommendation logic
│   ├── artifacts/              # pre-trained encoder, TF-IDF and feature matrices
│   └── test_recommender.py     # quick manual test
└── LICENSE
```

## Testing the recommender

```bash
cd ml-service
python test_recommender.py
```

## License

Released under the [MIT License](LICENSE).
