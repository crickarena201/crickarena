# CrickArena

A comprehensive cricket tournament management platform.

## Deployment to Render

This project is configured for deployment to Render using the blueprint method. The [render.yaml](file:///e:/crickarena/render.yaml) file defines two services:
1. Backend API service (Node.js)
2. Frontend static site (Vue.js)

### Prerequisites

1. A Render account
2. A MongoDB Atlas cluster
3. Firebase project credentials
4. Razorpay account credentials

### Deployment Steps

1. Fork this repository to your GitHub account
2. Log in to your Render account
3. Click "New Web Service" 
4. Connect your GitHub account and select your forked repository
5. Select "render.yaml" as the blueprint file
6. Review and confirm the services to be created:
   - `crickarena-backend` - Node.js web service
   - `crickarena-frontend` - Static site
7. Add the required environment variables in the Render dashboard:
   
   For the backend service:
   - `MONGO_URI` - Your MongoDB connection string
   - `CORS_ORIGIN` - Set to `https://your-frontend-url.onrender.com`
   - `FIREBASE_PROJECT_ID` - Your Firebase project ID
   - `FIREBASE_CLIENT_EMAIL` - Your Firebase client email
   - `FIREBASE_PRIVATE_KEY` - Your Firebase private key
   - `RAZORPAY_KEY_ID` - Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET` - Your Razorpay key secret

8. After the initial deployment completes:
   - Update the backend's `CORS_ORIGIN` environment variable with the actual frontend URL
   - Update the frontend's `VITE_API_BASE` environment variable if needed

9. The services will automatically rebuild and redeploy when you push changes to your repository

### Environment Variables

#### Backend (.env)
Create a [.env](file:///e:/crickarena/backend/.env) file in the backend directory with the following variables:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crickarena?retryWrites=true&w=majority
CORS_ORIGIN=https://crickarena-frontend.onrender.com
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
PORT=4000
NODE_ENV=production
```

#### Frontend (.env.production)
The frontend uses Vite's environment variables:
```env
VITE_API_BASE=https://crickarena-backend.onrender.com/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
```

### Health Checks

- Backend: `GET /health` - Returns `{ ok: true }`
- Frontend: Access the site URL to verify it loads correctly

### URLs After Deployment

- Backend API: `https://crickarena-backend.onrender.com`
- Frontend: `https://crickarena-frontend.onrender.com`

### Notes

1. The frontend is configured with Vue Router history mode and includes rewrite rules in the render.yaml
2. The backend uses CORS to allow requests from the frontend domain
3. Both services are configured with free-tier plans which include sleep mode for inactive applications

## Tech Stack
- **Frontend**: Vue 3, Vite, Pinia, Vue Router, Tailwind CSS
- **Auth (Web)**: Firebase Web SDK (Email/Password, Google), session cookies to backend
- **Backend**: Node.js, Express 5, Mongoose (MongoDB), Firebase Admin, Helmet, CORS, Rate limiting, Joi validation
- **Database**: MongoDB
- **Email**: Nodemailer (SMTP) — currently reserved for future use

## Repository Structure
```
crickarena/
├─ backend/
│  ├─ server.js              # Express bootstrapping, security, routing
│  ├─ routes/                # auth, users, clubs, tournaments, admin
│  ├─ models/                # User, Club, Tournament, Match
│  ├─ middleware/            # auth (Firebase), rbac, validation
│  ├─ config/                # db, firebaseAdmin, mailer
│  └─ utils/logger.js        # logger + error handler
├─ frontend/
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ .env                   # Vite app env (example included)
│  └─ src/
│     ├─ main.js             # App bootstrap + auth init
│     ├─ router/             # Route guards (auth/admin/clubManager)
│     ├─ store/auth.js       # Firebase auth, API session cookie, profile
│     ├─ firebase/client.js  # Firebase client initialization
│     ├─ pages/              # Views
│     └─ assets/, components/, utils/
└─ README.md (this file)
```

## Backend Setup
1. Install dependencies
   ```bash
   cd backend
   npm install
   ```
2. Create `backend/.env`
   ```ini
   # Server
   NODE_ENV=development
   PORT=4000
   CORS_ORIGIN=http://localhost:5173

   # MongoDB
   MONGO_URI=mongodb://localhost:27017

   # Firebase Admin (Service Account)
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
   # You can paste the raw PEM or a base64 body with \n newlines; code normalizes both
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
   # SMTP (optional, for future email features)
   SMTP_HOST=localhost
   SMTP_PORT=587
   SMTP_USER=
   SMTP_PASS=
   MAIL_FROM="CrickArena <no-reply@crickarena.local>"
   ```
3. Run the API
   ```bash
   npm run dev
   # API: http://localhost:4000
   # Health check: http://localhost:4000/health
   ```

### Security and Middleware
- **CORS**: Only origins in `CORS_ORIGIN` are allowed (comma‑separated list supported)
- **Helmet**: Basic CSP + security headers
- **Rate Limiting**: Global limiter and stricter limiter for auth routes
- **Cookies**: Session cookie `session` (HTTP‑only; `secure`+`SameSite=None` in production)

## Frontend Setup
1. Install dependencies
   ```bash
   cd frontend
   npm install
   ```
2. Configure `frontend/.env` (example present in repo)
   ```ini
   VITE_API_BASE=http://localhost:4000/api

   VITE_FIREBASE_API_KEY=...your...
   VITE_FIREBASE_AUTH_DOMAIN=...your...
   VITE_FIREBASE_PROJECT_ID=...your...
   VITE_FIREBASE_APP_ID=...your...
   VITE_FIREBASE_STORAGE_BUCKET=...your...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...your...
   ```
3. Run the app
   ```bash
   npm run dev
   # App: http://localhost:5173
   ```

## Authentication Flow
- Frontend uses Firebase Web Auth (Google or Email/Password).
- After sign‑in, frontend obtains ID token and calls `POST /api/auth/session/login` to create a secure session cookie.
- Backend verifies session cookie or bearer token on protected routes.

## Data Models (simplified)
- **User**: `{ firebaseUid, name, email, role: 'admin'|'clubManager'|'public', club?, emailVerified }`
- **Club**: Registration fields (clubName, district, city, contact, etc.), status workflow (`pending|approved|rejected`), logo (binary or URL), manager relation
- **Tournament**: `{ name, description, format, status, startDate, endDate, maxTeams, registrationDeadline, organizer, participants[], registrations[] }`
- **Match**: `{ tournament, homeClub, awayClub, date, time, venue, result }`

## API Overview
Base URL: `http://localhost:4000/api`

- **Auth** (`/auth`)
  - `POST /session/login` → Exchange Firebase ID token for session cookie
  - `POST /session/logout` → Clear session cookie
  - `POST /register` → Create/Update user profile (requires valid Firebase token; blocks disposable emails; validates input)
  - `GET /profile` → Get current user profile

- **Users** (`/users`)
  - `GET /me` → Current user (protected)
  - `PUT /me` → Update profile (protected)

- **Clubs** (`/clubs`)
  - `POST /register` → Submit club registration (role: clubManager)
  - `GET /my-club` → Fetch manager’s club
  - `PUT /my-club` → Update club; if approved, transitions back to pending for re‑approval
  - `GET /public` → List approved clubs (public)
  - `GET /public/:id` → Approved club details (public)
  - `GET /:id/logo` → Serve logo binary (if stored)
  - Admin legacy: `PUT /:id/approve`, `PUT /:id/reject`

- **Tournaments** (`/tournaments`)
  - `GET /open` → Public open tournaments
  - `GET /upcoming` → Upcoming/ongoing
  - `GET /history` → Completed
  - `GET /:id` → Details
  - `GET /:id/matches` → Matches
  - Club manager: `GET /mine`, `POST /:id/register`

- **Admin** (`/admin`) — role: admin
  - `GET /clubs` → List club registrations (optional `?status=`)
  - `GET /stats` → Aggregated stats
  - `PUT /clubs/:id/approve` / `PUT /clubs/:id/reject` → Moderate registrations
  - Tournaments: `POST /tournaments`, `GET /tournaments`, `PUT /tournaments/:id`, `PUT /tournaments/:id/cancel`, `GET /tournaments/:id/registrations`, `PUT /tournaments/:id/registrations/:regId/:action`

## Role‑Based Access
- Roles: `public`, `clubManager`, `admin` (stored on User model)
- Frontend route guards ensure only authorized roles reach admin/club manager pages.
- Backend enforces with `verifyFirebaseToken` + `requireRole` middleware.

## Development Tips
- If CORS errors occur, set `CORS_ORIGIN=http://localhost:5173` (or your dev URL) and restart the backend.
- For Firebase Admin private key, preserve newlines. If using env with escaped `\n`, the backend normalizes it.
- In production, use HTTPS so `secure` cookies work with `SameSite=None`.
- Ensure MongoDB is running and `MONGO_URI` is reachable.

## Scripts
- Backend: `npm run dev` (watch), `npm start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## Notes
- OTP flow is removed for registration; email transport is kept for future features.
- Some legacy fields are kept for backward compatibility (e.g., `Club.name`, `Tournament.date`, `participants`).

## Missing Repo Metadata (Optional)
The helper file `.zencoder/rules/repo.md` is not present. Creating it enables richer automated assistance for future maintenance. If you want, I can generate it based on this analysis.