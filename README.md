# Project Management Portal

A comprehensive full-stack web application for managing projects, clients, users, and tracking activities in a project management system. Built with modern technologies for scalability and maintainability.

## 🚀 Features

### Core Features
- **User Management**: Role-based access control (Admin, Manager, Team Member, Client)
- **Project Management**: Create, update, and track projects with status transitions
- **Role-Based Project Visibility**: Clients see only their projects; Users see assigned projects
- **Client Management**: Manage client information and relationships
- **Activity Logging**: Automatic logging of all write operations with analytics
- **Dashboard Analytics**: Beautiful graphs and charts for activity insights
- **Authentication & Authorization**: JWT-based secure authentication with RBAC
- **Responsive UI**: Modern React-based frontend with Material-UI components
- **RESTful API**: Well-structured backend API with comprehensive endpoints

### User Profile Features
- **Personal Profile Management**: Users can edit their name, email, and password
- **Client Profile Page**: Clients can manage personal details and company information (company name, contact person, address, phone)
- **Password Security**: Secure password change functionality with validation

### Admin Features
- **Admin Settings**: Password change and system-level configuration options
- **Admin Reports**: Activity reporting with date range filtering and CSV export capability
- **System Configuration**: Manage email notifications, two-factor authentication, and maintenance mode settings

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Winston** - Logging
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download](https://git-scm.com/)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-management-portal
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install --legacy-peer-deps
   cd ..
   ```

## 🗄 Database Setup

1. **Create MySQL database**
   ```sql
   CREATE DATABASE project_management_portal;
   ```

2. **Import database schema**
   ```bash
   mysql -u your_username -p project_management_portal < backend/database_schema.sql
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   # Database Configuration
   DATABASE_HOST=localhost
   DATABASE_USER=your_mysql_username
   DATABASE_PASSWORD=your_mysql_password
   DATABASE_NAME=project_management_portal

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=5000

   # CORS Configuration (optional)
   CORS_ORIGIN= ["http://localhost:5173", "http://localhost:3000"]
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 🔐 Test Credentials

Use the following test credentials to explore the application with different user roles:

### Admin Account
```
Email: AdminOne@gmail.com
Password: Admin@123
```
**Access**: Full system access including user management, reports, settings, and all admin features.

### Client Account
```
Email: ClientOne@gmail.com
Password: Client@123
```
**Access**: Limited to client-specific features including profile management and own projects.

### User/Team Member Account
```
Email: UserOne@gmail.com
Password: User@123
```
**Access**: Can view assigned projects, manage personal profile, and track activities.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `PUT /api/auth/profile` - Update user profile (name, email)
- `PUT /api/auth/profile/password` - Change user password

### User Management
- `GET /api/user` - Get all users (Admin only)
- `GET /api/auth/profile` - Get current user profile
- `POST /api/user` - Create user (Admin only)
- `PUT /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user (Admin only)

### Project Management
- `GET /api/project` - Get all projects (Admin/Manager); filtered by role for clients/users
- `GET /api/project/assigned` - Get assigned projects for current user
- `POST /api/project` - Create project
- `PUT /api/project/:id/status` - Update project status

### Client Management
- `GET /api/client` - Get all clients
- `GET /api/client/me` - Get current client profile (for client users)
- `POST /api/client` - Create client
- `PUT /api/client/:id` - Update client information
- `PUT /api/client/me` - Update current client profile (company details)
- `DELETE /api/client/:id` - Delete client

### Activity Analytics
- `GET /api/activity/stats` - Get activity statistics
- `GET /api/activity/timeline?period=day` - Get activity timeline (period: day/week/month)
- `GET /api/activity/by-user` - Get activity by user
- `GET /api/activity/recent?limit=10` - Get recent activities
- `GET /api/activity?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get activity with date filtering

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🔐 Authentication

The application uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

- **Admin**: Full access to all features
- **Manager**: Can manage projects and view reports
- **Team Member**: Can view and update assigned projects
- **Client**: Limited access to view their projects

## 📊 Activity Logging

All write operations (create, update, delete) are automatically logged in the `activity_logs` table with:
- User who performed the action
- Action type
- Entity type (user/project/client)
- Entity ID
- Timestamp

## 📄 Frontend Pages & Views

### User Views
- **Dashboard**: View assigned projects and activity overview
- **Profile**: Edit personal details and change password
- **Projects**: View and manage assigned projects
- **Activity**: View activity timeline and logs

### Client Views
- **Dashboard**: View company's projects and overview
- **Profile**: Manage personal user details and company information
  - Personal Details: Name and email
  - Company Details: Company name, contact person, email, phone, address
- **Projects**: View client-specific projects

### Admin Views
- **Dashboard**: System-wide analytics and overview
- **Settings**: Password management and system configuration
  - Change password
  - Email notifications toggle
  - Two-factor authentication settings
  - Maintenance mode toggle
- **Reports**: Activity reports with date filtering
  - Date range filtering (start date and end date)
  - CSV export of filtered reports
  - Activity analytics by user and time period
- **User Management**: Create, update, and delete users
- **Client Management**: Manage all clients
- **Projects**: View and manage all projects
- **Activity**: Comprehensive activity logs

## 🎯 Key Improvements & Fixes

### Recent Updates (v1.1.0)
- **Role-Based Access**: Fixed project visibility to ensure clients see only their projects and users see only assigned projects
- **Profile Management**: Users and clients can now manage their profile information directly
- **Admin Dashboard**: New settings and reports pages for administrators
- **Query Performance**: Resolved SQL GROUP BY issue affecting the `/api/project/assigned` endpoint
- **Frontend Framework**: Upgraded React Query to v5 with proper syntax (mutationFn, isPending, etc.)
- **Security**: Enhanced password change functionality with secure validation

### Fixed Issues
- ✅ SQL `ONLY_FULL_GROUP_BY` error on assigned projects endpoint
- ✅ React Query v5 `defaultMutationOptions` TypeError
- ✅ Project visibility not respecting user roles
- ✅ Client profile field mapping for form submissions

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build

```
