# PlacementPulse

PlacementPulse is a full-stack **Virtual Placement Cell Portal** designed to connect students, recruiters, and placement administrators in one platform.

The project provides student placement preparation tools, job and application management, recruiter workflows, and placement analytics.

## Features

### Student Portal
- Student registration and login
- Student profile management
- Resume upload and resume text management
- ATS Resume Checker
- Resume skill matching and improvement suggestions
- Resume heatmap
- Skill Gap Analyzer
- Placement readiness information
- Browse eligible jobs
- Apply for jobs
- Track application status
- Mock interviews
- Interview experience hub
- Notifications

### Recruiter Portal
- Recruiter login and registration
- Recruiter dashboard
- Post and manage jobs
- View student applications
- Update application status
- Schedule interviews and placement drives
- Candidate pipeline management

### Admin / Placement Officer Portal
- Placement analytics dashboard
- Placement rate and package statistics
- Branch and salary analytics
- Student verification
- Job post approval/rejection

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- React 18
- HTM
- Chart-based placement analytics
- Browser Local Storage for authentication token handling

### Backend
- Node.js
- Express.js
- REST API
- Mongoose
- MongoDB
- JWT authentication
- bcryptjs
- CORS
- dotenv
- MongoDB Memory Server fallback for local development

## Project Structure

```text
PlacementPulse/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── scripts/
│   │   └── seed.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontened/
│   ├── css/
│   ├── js/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── utils/
│   │   └── views/
│   ├── index.html
│   ├── build-bundle.ps1
│   └── server.ps1
│
└── .gitignore
```

> Note: The frontend directory is currently named `frontened` in the project.

## Backend Setup

### 1. Open the backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `backend/`.

Use `.env.example` as a template:

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/placement_pulse
JWT_SECRET=your_jwt_secret_here
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

**Never commit the real `.env` file or database credentials to GitHub.**

### 4. Start the backend

```bash
npm start
```

The API runs by default at:

```text
http://127.0.0.1:8000/api
```

Health check:

```text
GET http://127.0.0.1:8000/api/health
```

### Development mode

```bash
npm run dev
```

### Seed sample data

```bash
npm run seed
```

If MongoDB is unavailable during startup, the backend can fall back to an in-memory MongoDB server for development.

## Frontend Setup

The frontend uses local React/ReactDOM/HTM libraries and does not require a separate `npm install`.

Open another terminal:

```bash
cd frontened
```

Start the included PowerShell static server:

```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```

Then open:

```text
http://localhost:8080/
```

The frontend API client is configured to communicate with:

```text
http://127.0.0.1:8000/api
```

Make sure the backend is running before using features that communicate with the REST API.

## API Modules

The backend exposes REST endpoints for:

| Module | Base Endpoint |
|---|---|
| Authentication | `/api/auth` |
| Students | `/api/students` |
| Jobs | `/api/jobs` |
| Applications | `/api/applications` |
| ATS | `/api/ats` |
| Interview Experiences | `/api/experiences` |
| Notifications | `/api/notifications` |
| Analytics | `/api/analytics` |

Example health check:

```http
GET /api/health
```

## Authentication

The application uses JWT-based authentication.

After login, the frontend stores the JWT token in browser Local Storage and sends it with API requests using:

```http
Authorization: Bearer <token>
```

Protected backend routes use authentication middleware to validate the token.

## ATS Resume Analysis

The ATS module compares resume text with the required skills for a selected target role.

The analyzer provides:
- ATS score
- Matched skills
- Missing skills
- Strengths
- Improvement suggestions

Example target roles include:
- Full-Stack Software Engineer
- Data Scientist / AI Engineer
- Backend Systems Developer
- Frontend UI/UX Specialist

## Frontend ↔ Backend Communication

The frontend uses a JavaScript API client to communicate with the Express REST API.

```text
React Frontend
      |
      | HTTP / JSON
      v
Express REST API
      |
      | Mongoose
      v
MongoDB Atlas / MongoDB
```

JWT tokens are used to authorize protected requests.

## Running the Complete Project

### Terminal 1 — Backend

```bash
cd D:\wtproject\backend
npm install
npm start
```

### Terminal 2 — Frontend

```powershell
cd D:\wtproject\frontened
powershell -ExecutionPolicy Bypass -File .\server.ps1
```

Open:

```text
http://localhost:8080/
```

Backend API:

```text
http://127.0.0.1:8000/api
```

## Security Notes

- Keep `backend/.env` private.
- Do not commit MongoDB credentials.
- Do not commit JWT secrets.
- `node_modules/` and `.env` are excluded through `.gitignore`.
- Use `.env.example` to document required environment variables.

## Future Improvements

- Deploy frontend and backend separately
- Add production environment configuration
- Improve role-based access control
- Add real resume file parsing
- Add richer analytics and reporting
- Add automated testing
- Add CI/CD with GitHub Actions

## License

This project is intended for educational and academic project use.
