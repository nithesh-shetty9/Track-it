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
- `GET /dashboard/summary`, `GET /search?q=`, `GET /notifications`, `PATCH /notifications/read`

Authorization is based on `ProjectMember` role (OWNER, ADMIN, MEMBER), never on `Project.type`.
