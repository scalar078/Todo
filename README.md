# TaskFlow — Scalable Web App with Authentication & Dashboard

A full-stack task management application built with **React.js**, **Node.js/Express**, and **MongoDB**. Features JWT-based authentication, a responsive dashboard with full CRUD operations, search/filter functionality, and secure API design.

---

## Tech Stack

| Layer      | Technology                             |
| ---------- | -------------------------------------- |
| Frontend   | React 18, Vite, TailwindCSS           |
| Backend    | Node.js, Express.js                    |
| Database   | MongoDB + Mongoose                     |
| Auth       | JWT (jsonwebtoken) + bcrypt            |
| Validation | express-validator (server), custom (client) |

---

## Project Structure

```
taskflow/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── api/            # Axios instance & interceptors
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context (React Context API)
│   │   └── pages/          # Page-level components
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Express backend
│   ├── config/             # DB connection config
│   ├── middleware/          # Auth & error-handling middleware
│   ├── models/             # Mongoose models (User, Task)
│   ├── routes/             # API route handlers
│   ├── validators/         # express-validator schemas
│   └── server.js           # App entry point
├── api-docs/               # Postman collection
├── SCALING_NOTES.md        # Production scaling strategy
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **MongoDB** (local install or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone <repo-url>
cd taskflow
```

### 2. Setup the backend

```bash
cd server
cp .env.example .env     # then edit .env with your values
npm install
npm run dev               # starts on http://localhost:5000
```

### 3. Setup the frontend

```bash
cd client
npm install
npm run dev               # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend automatically.

---

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_change_this
CLIENT_URL=http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint           | Auth | Description              |
| ------ | ------------------ | ---- | ------------------------ |
| POST   | /api/auth/signup   | No   | Register a new user      |
| POST   | /api/auth/login    | No   | Login & receive JWT      |
| GET    | /api/profile       | Yes  | Get current user profile |
| PUT    | /api/profile       | Yes  | Update user profile      |
| GET    | /api/tasks         | Yes  | List tasks (search/filter/paginate) |
| GET    | /api/tasks/:id     | Yes  | Get single task          |
| POST   | /api/tasks         | Yes  | Create a task            |
| PUT    | /api/tasks/:id     | Yes  | Update a task            |
| DELETE | /api/tasks/:id     | Yes  | Delete a task            |
| GET    | /api/health        | No   | Health check             |

Full API documentation is available in the **Postman collection** at `api-docs/TaskFlow.postman_collection.json`.

---

## Features

- **Authentication**: Signup, login, logout with JWT stored in localStorage
- **Protected Routes**: Dashboard & profile require authentication
- **Task CRUD**: Create, read, update, delete tasks
- **Search & Filter**: Search by title/description; filter by status & priority
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Form Validation**: Client-side + server-side validation
- **Password Security**: bcrypt hashing with salt rounds of 12
- **Error Handling**: Centralized error middleware on backend

---

## Scripts

### Backend (`server/`)

| Command       | Description                  |
| ------------- | ---------------------------- |
| `npm start`   | Start production server      |
| `npm run dev` | Start dev server (nodemon)   |

### Frontend (`client/`)

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start Vite dev server        |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview production build     |

---

## License

MIT
