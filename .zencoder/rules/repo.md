---
description: Repository Information Overview
alwaysApply: true
---

# CrickArena Information

## Summary
CrickArena is a cricket club management system for Kerala, featuring a comprehensive portal for club registration, management, and administration. The system includes club registration, club manager dashboard, and admin dashboard components.

## Structure
- **frontend/**: Vue.js application with Vite build system
- **backend/**: Node.js/Express API server with MongoDB database
- **CLUB_MANAGEMENT_SYSTEM.md**: Detailed project documentation

## Repository Components
- **Frontend**: Vue 3 SPA with Tailwind CSS and Firebase authentication
- **Backend**: Express.js REST API with MongoDB database and JWT authentication

## Projects

### Frontend (Vue.js)
**Configuration File**: frontend/package.json

#### Language & Runtime
**Language**: JavaScript (Vue.js)
**Version**: Vue 3.4.31
**Build System**: Vite 5.3.3
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- vue: ^3.4.31
- vue-router: ^4.3.3
- pinia: ^2.1.7
- axios: ^1.7.4
- firebase: ^10.12.4

**Development Dependencies**:
- @vitejs/plugin-vue: ^5.0.5
- tailwindcss: ^3.4.10
- postcss: ^8.4.39
- autoprefixer: ^10.4.19

#### Build & Installation
```bash
cd frontend
npm install
npm run dev    # Development server
npm run build  # Production build
```

#### Main Files
**Entry Point**: frontend/src/main.js
**App Component**: frontend/src/App.vue
**Router**: frontend/src/router/index.js
**Store**: frontend/src/store (Pinia)

### Backend (Node.js/Express)
**Configuration File**: backend/package.json

#### Language & Runtime
**Language**: JavaScript (Node.js)
**Version**: ES Modules (type: module)
**Framework**: Express 5.1.0
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- express: ^5.1.0
- mongoose: ^8.17.1
- jsonwebtoken: ^9.0.2
- bcrypt: ^6.0.0
- firebase-admin: ^13.4.0
- dotenv: ^17.2.1
- express-validator: ^7.2.1
- nodemailer: ^7.0.5
- cors: ^2.8.5
- helmet: ^8.1.0

**Development Dependencies**:
- nodemon: ^3.1.10

#### Build & Installation
```bash
cd backend
npm install
npm run dev    # Development with auto-restart
npm start      # Production server
```

#### Main Files
**Entry Point**: backend/server.js
**Routes**: backend/routes/
**Models**: backend/models/
**Config**: backend/config/
**Middleware**: backend/middleware/

#### Database
**Type**: MongoDB
**Connection**: Mongoose ODM
**Models**:
- User
- Club
- Tournament
- Match
- OtpToken

## Security & Authentication
**Authentication**: Firebase Authentication with JWT tokens
**Authorization**: Role-based access control (RBAC)
**API Security**:
- Helmet for HTTP headers
- Rate limiting
- CORS configuration
- Input validation