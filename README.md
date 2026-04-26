# Project Management Portal

A comprehensive full-stack web application for managing projects, clients, users, and tracking activities in a project management system. Built with modern technologies for scalability and maintainability.

## 🚀 Features

- **User Management**: Role-based access control (Admin, Manager, Team Member, Client)
- **Project Management**: Create, update, and track projects with status transitions
- **Client Management**: Manage client information and relationships
- **Activity Logging**: Automatic logging of all write operations with analytics
- **Dashboard Analytics**: Beautiful graphs and charts for activity insights
- **Authentication & Authorization**: JWT-based secure authentication with RBAC
- **Responsive UI**: Modern React-based frontend with Material-UI components
- **RESTful API**: Well-structured backend API with comprehensive endpoints

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
   npm install
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
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=project_management_portal

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # CORS Configuration (optional)
   CORS_ORIGIN=http://localhost:3000
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

### Production Mode

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend in production**
   ```bash
   cd backend
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Management
- `GET /api/user` - Get all users (Admin only)
- `POST /api/user` - Create user (Admin only)
- `PUT /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user (Admin only)

### Project Management
- `GET /api/project` - Get all projects with client and user details
- `POST /api/project` - Create project
- `PUT /api/project/:id/status` - Update project status

### Client Management
- `GET /api/client` - Get all clients
- `POST /api/client` - Create client
- `PUT /api/client/:id` - Update client
- `DELETE /api/client/:id` - Delete client

### Activity Analytics
- `GET /api/activity/stats` - Get activity statistics
- `GET /api/activity/timeline?period=day` - Get activity timeline (period: day/week/month)
- `GET /api/activity/by-user` - Get activity by user
- `GET /api/activity/recent?limit=10` - Get recent activities

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

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Build & Deployment

### Backend
```bash
cd backend
npm run build  # If using TypeScript
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with a static server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core project management features
  - User authentication and authorization
  - Project and client management
  - Activity logging and analytics
  - Responsive dashboard

---

**Happy coding! 🎉**