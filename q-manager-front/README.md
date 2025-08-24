# Q-Manager Frontend

A modern React TypeScript application for queue management with authentication system.

## Features

- 🔐 **Authentication System**: Complete login/register functionality with JWT tokens
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🔄 **State Management**: React Context for authentication state
- 🛡️ **Form Validation**: Yup validation with error handling
- 🚀 **TypeScript**: Full type safety throughout the application

## Authentication System

The application includes a complete authentication system with the following features:

### Frontend Components
- **Login Page**: User login with email and password
- **Register Page**: User registration with username, email, and password
- **AuthContext**: Global state management for authentication
- **Protected Routes**: Automatic redirection for authenticated users

### API Integration
- **API Service**: Centralized API calls with error handling
- **Token Management**: Automatic token storage and retrieval
- **CORS Support**: Cross-origin request handling

### Backend Integration
- **Laravel API**: RESTful API endpoints for authentication
- **Token Authentication**: Custom token-based authentication
- **Database Storage**: Secure token storage with expiration

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Project Structure

```
src/
├── api/                    # API services
│   ├── auth.ts            # Authentication API
│   └── index.ts           # API exports
├── constants/              # Application constants
│   ├── endpoints.ts       # API endpoints
│   └── links.ts           # Route links
├── pages/                  # Page components
│   ├── Login/             # Login page
│   ├── Register/          # Register page
│   └── Home/              # Home page
├── shared/                 # Shared components
│   └── FormWrapper/       # Form wrapper component
├── store/                  # State management
│   └── AuthContext.tsx    # Authentication context
└── styles/                 # Global styles
    └── index.css          # Tailwind CSS
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Backend Setup

Make sure the Laravel backend is running and the database is migrated:

```bash
cd q-manager-back
php artisan migrate
php artisan serve
```

## Usage

### Authentication Flow

1. **Registration**: Users can create new accounts with username, email, and password
2. **Login**: Users can log in with email and password
3. **Token Storage**: Authentication tokens are automatically stored in localStorage
4. **Protected Routes**: Authenticated users are redirected to the home page
5. **Logout**: Users can log out, which clears the token and redirects to login

### Form Validation

The application uses Yup for form validation with the following rules:

#### Login Form
- Email: Required, valid email format
- Password: Required, minimum 6 characters

#### Register Form
- Username: Required, 3-20 characters, alphanumeric + underscore
- Email: Required, valid email format, unique
- Password: Required, minimum 6 characters, must contain uppercase, lowercase, and number

## Styling

The application uses Tailwind CSS for styling with:
- Responsive design
- Modern gradient backgrounds
- Smooth transitions and animations
- Consistent color scheme
- Professional form styling

## Error Handling

- **API Errors**: Proper error messages displayed to users
- **Validation Errors**: Field-specific error messages
- **Network Errors**: Graceful handling of connection issues
- **Token Expiration**: Automatic logout on token expiration

## Security Features

- **Password Hashing**: Passwords are hashed on the backend
- **Token Authentication**: Secure token-based authentication
- **CORS Protection**: Proper CORS configuration
- **Input Validation**: Server-side and client-side validation
- **XSS Protection**: Sanitized user inputs

## Development

### Adding New API Endpoints

1. Add the endpoint to `src/constants/endpoints.ts`
2. Create the API function in the appropriate service file
3. Export from `src/api/index.ts`
4. Use in your components

### Adding New Protected Routes

1. Create the component
2. Add the route to `src/pages/App.tsx`
3. Use the `useAuth` hook to check authentication status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
