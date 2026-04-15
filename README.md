# EduSchedule - College Scheduling & Appointment Booking System

A full-stack, responsive web application for managing college schedules, class timetables, and faculty-student appointment bookings. Built with **React** (Vite), **Node.js** (Express), **MongoDB** (Mongoose), and secured via **JWT/Bcrypt**.

## Prerequisites
Before running this project from scratch, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v16.0 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally on default port `27017`)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (Optional, for database inspection)

---

## 1. Local MongoDB Setup
Ensure your local MongoDB server is active. The backend is configured to connect to your local database at:
`mongodb://127.0.0.1:27017/appointment-project`

---

## 2. Backend Setup
The backend is a Node.js Express API that handles authentication, database models, and scheduling logic.

Open a terminal and navigate to the `server` directory:
```bash
cd server
```

Install backend dependencies:
```bash
npm install
```

### Seeding the Database
To populate the database with initial users, courses, classes, and appointments, run the seed script:
```bash
npx tsx seed.ts
```
*(This creates the default Admin, Faculty, and Student users with hashed passwords).*

### Start the Server
Run the Express server in development mode:
```bash
npx tsx index.ts
```
**Expected Output:** `Server is running on http://localhost:3001` and `Connected to MongoDB via Mongo Compass!`

---

## 3. Frontend Setup
The frontend is a React Single Page Application (SPA) built with Vite. It automatically proxies `/api` requests to the local backend.

Open a **new** terminal (keep the backend server running) and stay in the root project directory:
```bash
# Assuming you are in the root directory (Appointment_project)
npm install
```

Start the Vite development server:
```bash
npm run dev
```

**Expected Output:** Formats a local link for you to visit, typically:
`http://localhost:5173/`

---

## 4. Test Accounts
Once both servers are running, access the frontend in your browser. You can log in using these generated credentials (or sign up as a new user!):

- **Student Role**
  - Email: `tarun@college.edu`
  - Password: `password123`

- **Faculty Role**
  - Email: `rajit@college.edu`
  - Password: `password123`

- **Admin Role**
  - Email: `admin@college.edu`
  - Password: `password123`
