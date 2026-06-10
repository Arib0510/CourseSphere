# University Course Registration System

## Complete Development Guide

---

# 1. Project Overview

This project is a real-world, deployable, user-friendly University Course Registration System built using:

- React
- Tailwind CSS
- Node.js
- Express.js
- Supabase
- Supabase Authentication

The system allows:

- Students to register courses online
- Admins to manage courses and registrations
- Secure authentication and authorization
- Real deployment to production

---

# 2. Main Features

## Student Features

- Student Signup/Login
- Browse Available Courses
- Search Courses
- Semester Filtering
- Register Courses
- Drop Courses
- View Registered Courses
- Responsive Dashboard

## Admin Features

- Admin Login
- Add/Edit/Delete Courses
- View Registrations
- Manage Students
- Dashboard Analytics

---

# 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Version Control | GitHub |

---

# 4. System Architecture

```text
Frontend (React + Tailwind)
        ↓
REST API (Node.js + Express)
        ↓
Supabase PostgreSQL Database
        ↓
Supabase Authentication
```

---

# 5. Development Phases

| Phase | Goal |
|---|---|
| Phase 1 | Project Planning |
| Phase 2 | Database Design |
| Phase 3 | Backend Development |
| Phase 4 | Frontend Development |
| Phase 5 | Authentication |
| Phase 6 | Admin Dashboard |
| Phase 7 | Security |
| Phase 8 | Testing |
| Phase 9 | Deployment |
| Phase 10 | Production Optimization |

---

# PHASE 1 — PROJECT PLANNING

## Step 1 — Define User Roles

### Student

Students can:

- Login
- Register courses
- Drop courses
- Search/filter courses

### Admin

Admins can:

- Manage courses
- Manage semesters
- View registrations
- Manage students

---

## Step 2 — Define Database Entities

Required Tables:

| Table | Purpose |
|---|---|
| users | Authentication users |
| profiles | Student profiles |
| courses | Course information |
| registrations | Course registrations |
| admins | Admin accounts |

---

# PHASE 2 — DATABASE DESIGN

## Step 3 — Create Supabase Project

1. Go to Supabase
2. Create organization
3. Create project
4. Choose nearest region
5. Save:
   - Project URL
   - Anon Key

---

## Step 4 — Create Database Schema

### Profiles Table

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    student_id TEXT UNIQUE,
    department TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Courses Table

```sql
CREATE TABLE courses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    course_code TEXT UNIQUE NOT NULL,
    course_name TEXT NOT NULL,
    credit INTEGER NOT NULL,
    semester TEXT NOT NULL,
    department TEXT,
    capacity INTEGER DEFAULT 40,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Registrations Table

```sql
CREATE TABLE registrations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id UUID REFERENCES profiles(id),
    course_id BIGINT REFERENCES courses(id),
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(student_id, course_id)
);
```

### Admins Table

```sql
CREATE TABLE admins (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT UNIQUE NOT NULL
);
```

---

## Step 5 — Enable Row Level Security

```sql
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
```

### Student Read Policy

```sql
CREATE POLICY "Students view own registrations"
ON registrations
FOR SELECT
USING (auth.uid() = student_id);
```

### Student Insert Policy

```sql
CREATE POLICY "Students insert own registrations"
ON registrations
FOR INSERT
WITH CHECK (auth.uid() = student_id);
```

### Student Delete Policy

```sql
CREATE POLICY "Students delete own registrations"
ON registrations
FOR DELETE
USING (auth.uid() = student_id);
```

---

# PHASE 3 — BACKEND DEVELOPMENT

## Step 6 — Initialize Backend

```bash
mkdir backend
cd backend
npm init -y
```

---

## Step 7 — Install Backend Packages

```bash
npm install express cors dotenv @supabase/supabase-js jsonwebtoken bcryptjs
```

---

## Step 8 — Backend Folder Structure

```text
backend/
│
├── middleware/
├── routes/
├── controllers/
├── services/
├── utils/
├── .env
├── server.js
└── package.json
```

---

## Step 9 — Create Express Server

### server.js

```javascript
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("Server Running");
});
```

---

## Step 10 — Connect Supabase

### .env

```env
SUPABASE_URL=YOUR_URL
SUPABASE_KEY=YOUR_KEY
```

### services/supabase.js

```javascript
const { createClient } =
require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
```

---

# PHASE 4 — AUTHENTICATION

## Step 11 — Student Signup

```javascript
const { data, error } =
await supabase.auth.signUp({
  email,
  password
});
```

---

## Step 12 — Student Login

```javascript
const { data, error } =
await supabase.auth.signInWithPassword({
  email,
  password
});
```

---

## Step 13 — Store JWT

```javascript
localStorage.setItem(
  "token",
  data.session.access_token
);
```

---

# PHASE 5 — FRONTEND DEVELOPMENT

## Step 14 — Create React App

```bash
npx create-react-app frontend
```

---

## Step 15 — Install Frontend Libraries

```bash
npm install axios react-router-dom react-icons react-toastify
```

---

## Step 16 — Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## Step 17 — Configure Tailwind

### tailwind.config.js

```javascript
content: [
  "./src/**/*.{js,jsx,ts,tsx}",
]
```

### index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Step 18 — Frontend Folder Structure

```text
frontend/
│
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── routes/
│   └── App.js
```

---

# PHASE 6 — BUILD UI PAGES

## Step 19 — Create Pages

| Page | Purpose |
|---|---|
| Login | Authentication |
| Signup | Create account |
| Dashboard | Student dashboard |
| Courses | Browse courses |
| Registrations | Registered courses |
| Admin Dashboard | Admin control |
| Manage Courses | CRUD operations |

---

## Step 20 — Build Navbar

Navbar includes:

- Logo
- Profile section
- Logout button
- Responsive mobile menu

---

## Step 21 — Build Course Card

Each card shows:

- Course Code
- Course Title
- Semester
- Credit
- Register Button

---

## Step 22 — Add Search Feature

```javascript
GET /courses?search=data
```

---

## Step 23 — Add Semester Filter

```javascript
GET /courses?semester=Spring
```

---

## Step 24 — Register Course

Frontend:
- Click register button
- Send POST request

Backend:
- Insert into registrations table

---

## Step 25 — Drop Course

```javascript
DELETE /registrations/:id
```

---

# PHASE 7 — ADMIN DASHBOARD

## Step 26 — Admin Authentication

Store admin emails in:

```text
admins
```

table.

---

## Step 27 — Admin Features

| Feature | Function |
|---|---|
| Add course | Insert course |
| Edit course | Update course |
| Delete course | Remove course |
| View students | Analytics |
| View registrations | Reports |

---

## Step 28 — Build Analytics

Dashboard Cards:

- Total Students
- Total Courses
- Total Registrations

---

# PHASE 8 — SECURITY

## Step 29 — JWT Verification Middleware

```javascript
Authorization: Bearer TOKEN
```

---

## Step 30 — Protect Frontend Routes

Create:

- PrivateRoute
- AdminRoute

---

## Step 31 — Input Validation

Validation Includes:

- Required fields
- Duplicate prevention
- Capacity check

---

## Step 32 — Prevent Duplicate Registrations

```sql
UNIQUE(student_id, course_id)
```

---

# PHASE 9 — TESTING

## Step 33 — Backend API Testing

Tools:

- Postman
- Thunder Client

Test APIs:

- Login
- Registration
- Delete
- Admin APIs

---

## Step 34 — Frontend Testing

Test:

- Responsive UI
- Authentication
- Filtering
- Dashboard

---

# PHASE 10 — DEPLOYMENT

## Step 35 — Push Code to GitHub

1. Create GitHub repository
2. Push frontend
3. Push backend

---

## Step 36 — Deploy Backend Using Render

### Environment Variables

```env
SUPABASE_URL=
SUPABASE_KEY=
PORT=5000
```

### Build Command

```bash
npm install
```

### Start Command

```bash
node server.js
```

---

## Step 37 — Deploy Frontend Using Vercel

### Environment Variables

```env
REACT_APP_API_URL=
```

---

## Step 38 — Configure Production API URL

```javascript
baseURL:
"https://your-backend.onrender.com"
```

---

## Step 39 — Enable HTTPS + CORS

```javascript
app.use(cors({
  origin:
  "https://yourfrontend.vercel.app"
}));
```

---

# PHASE 11 — PRODUCTION OPTIMIZATION

## Step 40 — Add Loading States

Improves user experience.

---

## Step 41 — Add Toast Notifications

Use React Toastify.

---

## Step 42 — Add Skeleton Loaders

Professional loading animations.

---

## Step 43 — Mobile Responsiveness

Use Tailwind responsive utilities.

---

## Step 44 — Add Dark Mode

Optional but recommended.

---

## Step 45 — Add Pagination

Useful for large datasets.

---

## Step 46 — Add Logging

Track:

- API failures
- Errors
- System events

---

## Step 47 — Database Backup

Enable automatic backups in Supabase.

---

## Step 48 — Final Production Checklist

| Item | Status |
|---|---|
| Authentication | Required |
| Responsive UI | Required |
| Admin Dashboard | Required |
| Error Handling | Required |
| Secure API | Required |
| HTTPS | Required |
| Environment Variables | Required |
| Deployment | Required |

---

# Recommended Future Features

- GPA Calculator
- Faculty Portal
- Notice Board
- PDF Registration Slip
- OTP Authentication
- Email Verification
- Real-time Updates
- AI Course Recommendations

---

# Final Production Architecture

```text
Users
  ↓
React Frontend (Vercel)
  ↓
Node.js API (Render)
  ↓
Supabase PostgreSQL
  ↓
Supabase Authentication
```

---

# Recommended Development Order

```text
1. Database
2. Backend APIs
3. Authentication
4. Frontend UI
5. Registration System
6. Admin Dashboard
7. Security
8. Testing
9. Deployment
10. Optimization
```
