# Noted Sales CRM - Complete Project Explanation

## 📋 Project Overview

**Noted Sales CRM** is a full-stack Customer Relationship Management (CRM) application designed for sales professionals. It helps sales reps manage clients, track meetings, organize tasks, and get AI-powered insights about their client relationships.

**Developer:** Zach Shamieh (UCLA Computer Science student)  
**Purpose:** Built to practice full-stack development and align with career goals in Sales Engineering and Solutions Consulting  
**Inspiration:** Features suggested by an Account Executive at Oracle NetSuite, tested by real sales reps

---

## 🛠️ Tech Stack

### **Backend:**
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5.1.0
- **Database:** MongoDB (MongoDB Atlas cloud)
- **AI Integration:** OpenAI API (GPT-3.5-turbo)
- **Environment:** dotenv for configuration

### **Frontend:**
- **Framework:** React 19.1.1
- **Routing:** React Router DOM 7.8.0
- **Styling:** Tailwind CSS 3.4.17
- **Build Tool:** Vite 7.1.0

### **Deployment:**
- **Infrastructure:** AWS EC2
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Database Hosting:** MongoDB Atlas

---

## 🏗️ Architecture

### **Project Structure:**
```
Noted-Sales_CRM/
├── server/                    # Backend Express API
│   ├── server.js             # Main server entry point
│   ├── db/
│   │   └── connection.js     # MongoDB connection
│   └── routes/               # API route handlers
│       ├── auth.js           # Authentication (register/login)
│       ├── clients.js       # Client CRUD operations
│       ├── meetings.js      # Meeting management
│       ├── task.js          # Task management
│       └── ai.js            # AI insights generation
├── client/                    # Frontend React app
│   ├── src/
│   │   ├── main.jsx         # React Router setup
│   │   ├── App.jsx          # Main app component
│   │   └── components/      # React components
│   │       ├── Login.jsx
│   │       ├── ClientList.jsx
│   │       ├── Client.jsx
│   │       ├── UpcomingMeetings.jsx
│   │       ├── TaskManager.jsx
│   │       ├── AIInsights.jsx
│   │       ├── Navbar.jsx
│   │       └── LoginNavbar.jsx
└── .github/workflows/        # CI/CD pipelines
```

### **Communication Flow:**
```
Frontend (React) 
    ↓ HTTP Requests
Express API Server (Port 5050)
    ↓ MongoDB Driver
MongoDB Atlas (Cloud Database)
    ↓ OpenAI API
OpenAI GPT-3.5 (AI Insights)
```

---

## 💾 Database Structure (MongoDB)

### **Collections:**

#### **1. `users` Collection**
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  password: String (required, min 8 chars),
  createdAt: Date
}
```

#### **2. `records` Collection (Clients)**
```javascript
{
  _id: ObjectId,
  userId: String (required),  // Links to user
  client: String (required),  // Client name
  email: String,
  phone: String,
  notes: String,
  createdAt: Date
}
```

#### **3. `meetings` Collection**
```javascript
{
  _id: ObjectId,
  userId: String (required),  // Links to user
  clientId: String (optional), // Links to client
  title: String (required),
  meetingAt: Date (required),
  notes: String,
  meetingLink: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **4. `tasks` Collection**
```javascript
{
  _id: ObjectId,
  userId: String (required),  // Links to user
  clientId: String (optional), // Links to client
  text: String (required),
  dueAt: Date (required),
  status: String ("open" | "completed"),
  createdAt: Date,
  updatedAt: Date
}
```

### **Data Access Control:**
- All queries filter by `userId` to ensure users only access their own data
- Foreign key relationships maintained through `userId` and `clientId` fields
- No explicit foreign key constraints (MongoDB is schema-less)

---

## 🔌 API Endpoints

### **Base URL:** `http://localhost:5050` (or deployed server)

### **Authentication Routes (`/auth`):**
- `POST /auth/register` - Create new user account
  - Body: `{ username, password }`
  - Returns: User document with `_id`
  - Status: 201 (created) or 400 (validation error)

- `POST /auth/login` - Authenticate user
  - Body: `{ username, password }`
  - Returns: User document if valid
  - Status: 200 (success) or 401 (invalid credentials)

### **Client Routes (`/clients`):**
- `GET /clients?userId=<userId>` - Get all clients for a user
  - Returns: Array of client documents
  - Status: 200

- `GET /clients/:id?userId=<userId>` - Get single client
  - Returns: Client document
  - Status: 200 or 404

- `POST /clients` - Create or update client
  - Body: `{ userId, client, email, phone, notes, id? }`
  - If `id` provided: updates existing client
  - If no `id`: creates new client
  - Status: 201 (created) or 200 (updated)

- `DELETE /clients/:id?userId=<userId>` - Delete client
  - Status: 200 or 404

### **Meeting Routes (`/meetings`):**
- `GET /meetings?userId=<userId>` - Get all meetings for a user
- `GET /meetings/:id` - Get single meeting
- `POST /meetings` - Create or update meeting
  - Body: `{ userId, title, meetingAt, clientId?, notes?, meetingLink?, id? }`
- `DELETE /meetings/:id` - Delete meeting

### **Task Routes (`/task`):**
- `GET /task?userId=<userId>` - Get all tasks for a user (sorted by dueAt)
- `GET /task/:id` - Get single task
- `POST /task` - Create or update task
  - Body: `{ userId, text, dueAt, clientId?, status?, id? }`
- `DELETE /task/:id` - Delete task

### **AI Routes (`/ai`):**
- `POST /ai/insights` - Generate AI insights for a client
  - Body: `{ clientData: { client, email, phone, notes } }`
  - Returns: `{ insights: String }`
  - Uses OpenAI GPT-3.5-turbo to analyze client notes and provide sales recommendations

---

## 🎨 Frontend Structure

### **Routing (React Router):**
- `/` - Login page
- `/client-manager` - Client list and management
- `/upcoming-meetings` - Meeting calendar/list
- `/task-manager` - Task management interface
- `/ai-insights/:id` - AI insights for specific client

### **Key Components:**

1. **Login.jsx** - User authentication (register/login)
2. **ClientList.jsx** - Display and manage all clients
3. **Client.jsx** - Individual client detail/edit view
4. **UpcomingMeetings.jsx** - Display and manage meetings
5. **TaskManager.jsx** - Display and manage tasks
6. **AIInsights.jsx** - Display AI-generated insights for a client
7. **Navbar.jsx** - Navigation bar (authenticated users)
8. **LoginNavbar.jsx** - Navigation bar (login page)

### **State Management:**
- Uses React hooks (`useState`, `useEffect`)
- Stores `userId` in localStorage after login
- Fetches data from API on component mount
- No global state management library (Redux/Context)

### **Styling:**
- Tailwind CSS utility classes
- Responsive design
- Modern, clean UI

---

## 🔐 Authentication & Security

### **Current Implementation:**
- **Simple authentication:** Username/password stored in plain text (for development)
- **Session management:** `userId` stored in localStorage
- **No JWT tokens:** User ID passed as query parameter in API requests
- **Password requirements:** Minimum 8 characters

### **Security Notes:**
- Passwords are NOT hashed (development version)
- No HTTPS enforcement (development)
- CORS enabled for all origins
- Input validation on required fields

---

## 🚀 Deployment

### **Current Setup:**
- **Backend:** Single Express server on port 5050
- **Frontend:** Served from Express (static files) or separate Vite dev server
- **Database:** MongoDB Atlas (cloud)
- **Server:** AWS EC2 instance
- **Containerization:** Docker

### **Environment Variables:**
- `PORT` - Server port (default: 5050)
- `MONGOPASSWORD` - MongoDB Atlas password
- `OPENAI_API_KEY` - OpenAI API key for AI features

### **CI/CD:**
- GitHub Actions workflows
- Automated deployment on push to main branch
- Docker container builds and deploys

---

## 🎯 Key Features

### **1. Client Management**
- Create, read, update, delete client records
- Store client name, email, phone, notes
- Link clients to meetings and tasks

### **2. Meeting Tracking**
- Schedule meetings with date/time
- Link meetings to specific clients
- Store meeting notes and video call links
- View upcoming meetings

### **3. Task Management**
- Create tasks with due dates
- Link tasks to clients (optional)
- Track task status (open/completed)
- Sort tasks by due date

### **4. AI-Powered Insights**
- Generate sales insights based on client notes
- Uses OpenAI GPT-3.5-turbo
- Provides actionable recommendations
- Asks for more information if notes are insufficient

---

## 🔄 API Design Patterns

### **HTTP Methods:**
- **GET** - Retrieve data
- **POST** - Create or update (unified endpoint)
- **DELETE** - Remove data
- **No PATCH/PUT** - All updates use POST with `id` field

### **Response Patterns:**
- Success: Status 200/201 with data
- Error: Status 400/404/500 with error message
- Validation: Status 400 with specific error message

### **Query Parameters:**
- `userId` - Required for most endpoints to filter user data
- Used for data isolation between users

---

## 📝 Code Style & Patterns

### **Backend:**
- ES6 modules (`import/export`)
- Async/await for database operations
- Express Router for route organization
- Try/catch error handling
- Input validation before database operations
- Consistent error responses

### **Frontend:**
- Functional components with hooks
- React Router for navigation
- Fetch API for HTTP requests
- Tailwind CSS for styling
- Component-based architecture

### **Naming Conventions:**
- camelCase for variables/functions
- PascalCase for React components
- kebab-case for file names
- Descriptive variable names

---

## 🐛 Known Limitations / Future Improvements

1. **Security:**
   - Passwords not hashed (should use bcrypt)
   - No JWT token authentication
   - No HTTPS enforcement

2. **Features:**
   - No email notifications
   - No calendar integration
   - No file uploads
   - No search/filter functionality

3. **Database:**
   - No indexes on frequently queried fields
   - No data validation at database level
   - No transactions for complex operations

4. **UI/UX:**
   - No loading states
   - No error toasts/notifications
   - Basic styling (could be more polished)

---

## 📚 Dependencies Summary

### **Backend (`server/package.json`):**
- `express` - Web framework
- `mongodb` - Database driver
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `openai` - OpenAI API client

### **Frontend (`client/package.json`):**
- `react` & `react-dom` - UI framework
- `react-router-dom` - Routing
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `autoprefixer` & `postcss` - CSS processing

---

## 🎓 Learning Context

This project demonstrates:
- Full-stack JavaScript development
- RESTful API design
- MongoDB database operations
- React component architecture
- Authentication patterns
- AI integration (OpenAI)
- Docker containerization
- AWS cloud deployment
- CI/CD pipelines

Built by a student learning full-stack development, with real-world feedback from sales professionals.

---

## 📞 Contact & Links

**Developer:** Zach Shamieh  
**School:** UCLA (Computer Science)  
**Deployed URL:** http://3.141.106.235:5050  
**Repository:** GitHub (private/public)

---

*This document provides a comprehensive overview of the Noted Sales CRM project for AI assistants or developers who need to understand the codebase.*



