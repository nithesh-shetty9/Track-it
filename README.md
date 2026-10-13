# TrackIt

Task and project management app. React + Vite + Redux Toolkit frontend, Express + MongoDB backend with JWT in an HTTP-only cookie.

## Run

Backend (`backend/`): copy `.env.example` to `.env`, fill it in, then `npm install && npm start`.
MongoDB must support transactions (Atlas, or a local replica set), because creating a project and transferring ownership are atomic.

Frontend (`frontend/`): `npm install && npm run dev`. Set `VITE_API_URL` if the API is not on `http://localhost:8001`.

## API

- `POST /user/signup`, `POST /user/login`, `POST /user/logout`, `GET|PATCH /user/me`, `PATCH /user/password`
- `GET|POST /projects`, `GET|PATCH|DELETE /projects/:id` (DELETE archives), `POST /projects/join`, `GET /projects/:id/join-code` (owner only)
- `GET /projects/:id/members`, `PATCH|DELETE /projects/:id/members/:memberId`
- `GET|POST /tasks`, `GET|PATCH|DELETE /tasks/:id`
- `POST /tasks/:id/progress-notes` (assigned member or Owner/Admin)
- `GET|POST /projects/:id/chat`, `PATCH /projects/:id/chat/read`, `GET /projects/:id/chat/stream`
- `GET /dashboard/summary`, `GET /search?q=`, `GET /notifications`, `PATCH /notifications/read`

Authorization is based on `ProjectMember` role (OWNER, ADMIN, MEMBER), never on `Project.type`.

Task progress is persisted on the task (`progress` from 0 to 100) and is normalized with the existing status values: `TODO`, `IN_PROGRESS`, and `DONE`. Progress notes are append-only embedded task records with an authenticated author and timestamp.

Project chat is persisted in MongoDB and delivered through an authenticated Server-Sent Events stream. No new environment variables are required. The stream is process-local for delivery; MongoDB remains the source of truth and reconnects reload persisted history.
