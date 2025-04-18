# MealMate

MealMate is a desktop application that connects food donors with food banks and volunteers to help reduce food waste and address food insecurity.

## Project Structure

The project is divided into three main parts:

- **Backend**: Node.js/Express API with PostgreSQL database
- **Frontend**: React/TypeScript application built with Vite
- **Desktop App**: Electron wrapper for the web application

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## Quick Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/meal-mate.git
cd meal-mate
```

### 2. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE mealmate;
\q

# Initialize database schema and sample data
cd backend
node src/db/init_database.js
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory with the following content:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mealmate
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

### 4. Install Dependencies and Start Application

```bash
# Install all dependencies and start the application
npm install
npm start
```

This will start:
- Backend server on port 3000
- Frontend development server on port 5173
- Electron desktop application

### 5. Alternative: Start Components Individually

```bash
# Start backend only
npm run start:backend

# Start frontend only
npm run start:frontend

# Start Electron app only
npm run start:electron
```

## Features

- **User Roles**: Donors, Food Banks, Volunteers, and Administrators
- **Donation Management**: Create, track, and manage food donations
- **Volunteer Assignment**: Assign volunteers to pick up and deliver donations
- **Inventory Management**: Track food inventory at food banks
- **Real-time Notifications**: Get notified about donation status changes
- **Dashboard**: View statistics and reports

## Database Structure

MealMate uses a PostgreSQL database with tables in Third Normal Form (3NF):

- **users**: Stores all user accounts (donors, volunteers, food banks, admins)
- **donations**: Tracks donations from donors to food banks
- **categories**: Food categories for donations and inventory
- **donation_categories**: Junction table linking donations to categories
- **inventory**: Tracks food items at food banks
- **notifications**: User notifications for various events
- **audit_logs**: Tracks changes to data for auditing purposes

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Donations

- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create a new donation
- `GET /api/donations/:id` - Get a specific donation
- `PUT /api/donations/:id` - Update a donation
- `DELETE /api/donations/:id` - Delete a donation

### Food Banks

- `GET /api/foodbanks` - Get all food banks
- `GET /api/foodbanks/:id` - Get a specific food bank

### Volunteer Assignments

- `GET /api/volunteer-assignments` - Get all volunteer assignments
- `POST /api/volunteer-assignments` - Create a volunteer assignment

### Inventory

- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Create inventory item
- `GET /api/inventory/:id` - Get inventory item details
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

## Development Workflow

For local development and testing:

```bash
# Install all dependencies
npm install

# Start the application in development mode
npm start
```

This will start:
- The backend server on port 3000
- The frontend development server on port 5173
- The Electron application that connects to the frontend

This is all you need for development. No build step is required during development.

## Creating an Executable

When you're ready to create an executable (.exe) file for distribution:

1. Push your code to GitHub
2. Go to the "Actions" tab in your GitHub repository
3. Click on the "Build Electron App" workflow
4. Click "Run workflow" and select the branch you want to build from
5. Wait for the workflow to complete
6. Download the artifact named "MealMate-Windows" which contains your .exe file

**Note:** Users will still need to have PostgreSQL installed and configured on their system. The application does not bundle PostgreSQL.

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check that database credentials in `.env` are correct
- Verify that the database exists: `psql -U postgres -c "\l"`

### Port Conflicts

- If port 3000 is in use, change the PORT in `.env`
- If port 5173 is in use, the frontend will automatically try the next available port

