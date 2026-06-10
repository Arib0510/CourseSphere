# CourseSphere - University Course Registration System

CourseSphere is a full-stack, real-world, and deployable University Course Registration System. It provides a seamless and user-friendly platform for students to register for courses and for administrators to manage course offerings, registrations, and student data.

## 🚀 Features

### For Students
- **Authentication**: Secure Student Signup and Login.
- **Browse & Search**: Easily browse available courses and search by keywords.
- **Filtering**: Filter courses by semester to find exactly what you need.
- **Course Management**: Register for and drop courses with a few clicks.
- **Dashboard**: View registered courses on a responsive, intuitive dashboard.

### For Administrators
- **Admin Access**: Secure Admin Login.
- **Course Management**: Complete CRUD operations (Add, Edit, Delete) for courses.
- **Registration Tracking**: View and monitor all student registrations.
- **Student Management**: Manage student profiles and data.
- **Analytics Dashboard**: Get high-level insights on total students, courses, and registrations.

## 🛠️ Tech Stack

This project is built using modern web development technologies:

- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Backend API**: Node.js & Express.js
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Frontend Deployment**: Netlify (Recommended)
- **Backend Deployment**: Render (Recommended)

## 🏗️ System Architecture

```text
React Frontend (with Tailwind CSS)
        ↓
REST API (Node.js + Express.js)
        ↓
Supabase PostgreSQL Database
        ↓
Supabase Authentication
```

## 📂 Project Structure

- `/frontend`: React application containing the UI, state management, and API integration.
- `/backend`: Node.js/Express server handling API requests, database interactions, and business logic.
- `/database`: Database schemas, policies, and Supabase configurations.

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Supabase account and project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arib0510/CourseSphere.git
   cd CourseSphere
   ```

2. **Setup Backend**
   - Navigate to the `backend` directory.
   - Install dependencies: `npm install`
   - Create a `.env` file in the `backend/` folder (since `.env.example` has been removed) and add your Supabase credentials:
     ```env
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     NODE_ENV=development
     PORT=5000
     FRONTEND_URL=http://localhost:5173
     ```
   - Start the server: `npm run dev`

3. **Setup Frontend**
   - Navigate to the `frontend` directory.
   - Install dependencies: `npm install`
   - Create a `.env` file in the `frontend/` folder and add your frontend environment variables:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```
   - Start the development server: `npm run dev`

4. **Database Configuration**
   - Head over to Supabase and create the required tables (`profiles`, `courses`, `registrations`, `admins`).
   - Enable Row Level Security (RLS) and configure the appropriate policies.

## 🛡️ Security
- All sensitive API routes are protected using JWT Verification middleware.
- Input validation on both client and server sides.
- Duplicate registrations are prevented at the database level.
- Row Level Security (RLS) is strictly enforced in Supabase to guarantee that students can only access their own registration data.

## 🔮 Future Enhancements
- GPA Calculator
- Faculty Portal
- Real-time Updates & Notifications
- AI Course Recommendations
- OTP & Email Verification

---
*Built with ❤️ for a better course registration experience.*
