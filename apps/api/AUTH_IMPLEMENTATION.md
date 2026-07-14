# Authentication Backend Implementation

## Overview

Complete authentication system for SRM Bats e-commerce platform using NestJS, JWT, and Prisma.

## Features Implemented

### 1. User Registration
- **Endpoint**: `POST /auth/register`
- **Functionality**:
  - Email validation
  - Password hashing with bcrypt (10 salt rounds)
  - Duplicate email prevention
  - Automatic JWT token generation
  - Returns user data (excluding password) and tokens

### 2. User Login
- **Endpoint**: `POST /auth/login`
- **Functionality**:
  - Email and password validation
  - Password verification using bcrypt
  - JWT access and refresh token generation
  - Returns user data and tokens

### 3. Token Refresh
- **Endpoint**: `POST /auth/refresh`
- **Functionality**:
  - Validates refresh token
  - Generates new access and refresh tokens
  - Returns new token pair

### 4. Get User Profile
- **Endpoint**: `GET /auth/profile`
- **Functionality**:
  - Protected route (requires valid JWT)
  - Returns current user's profile
  - Excludes sensitive data (password)

## Technical Implementation

### File Structure

```
apps/api/src/auth/
├── dto/
│   ├── register.dto.ts       # Registration validation
│   ├── login.dto.ts          # Login validation
│   └── index.ts              # DTO exports
├── guards/
│   └── jwt-auth.guard.ts     # JWT authentication guard
├── strategies/
│   └── jwt.strategy.ts       # Passport JWT strategy
├── auth.controller.ts        # HTTP endpoints
├── auth.service.ts           # Business logic
└── auth.module.ts            # Module configuration
```

### Security Features

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Minimum 8 characters password requirement
   - Passwords never returned in responses

2. **JWT Configuration**
   - Access tokens: 15-minute expiration
   - Refresh tokens: 7-day expiration
   - Separate secrets for access and refresh tokens
   - Bearer token authentication

3. **Validation**
   - Email format validation
   - Required field validation
   - Password strength requirements
   - Request payload sanitization

### Error Handling

- **409 Conflict**: Duplicate email registration
- **401 Unauthorized**: Invalid credentials or expired token
- **400 Bad Request**: Invalid input data
- **404 Not Found**: User not found

## Configuration Required

### Environment Variables

Create a `.env` file in `apps/api/` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/srm_bats?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### Database Setup

Ensure your Prisma schema includes the User model:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

## API Usage Examples

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

**Response (201 Created)**:
```json
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Response (200 OK)**:
```json
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get Profile (Protected)

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK)**:
```json
{
  "id": "clx...",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Refresh Token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

**Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Testing

### Run E2E Tests

```bash
cd apps/api
npm test -- auth.e2e-spec.ts
```

### Manual Testing Script

```bash
chmod +x test-auth.sh
./test-auth.sh
```

## Integration with Frontend

### Store Tokens

```typescript
// After login or register
const { accessToken, refreshToken, user } = response.data;

// Store in localStorage or secure storage
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('user', JSON.stringify(user));
```

### Make Authenticated Requests

```typescript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/auth/profile', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

### Handle Token Refresh

```typescript
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('http://localhost:3000/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await response.json();
  
  localStorage.setItem('accessToken', newAccessToken);
  localStorage.setItem('refreshToken', newRefreshToken);
  
  return newAccessToken;
}
```

## Security Best Practices

1. **Production Secrets**
   - Use strong, randomly generated secrets
   - Never commit secrets to version control
   - Rotate secrets regularly

2. **HTTPS**
   - Always use HTTPS in production
   - Secure cookie flags if using cookies

3. **Rate Limiting**
   - Implement rate limiting on auth endpoints
   - Prevent brute force attacks

4. **Token Storage**
   - Use httpOnly cookies for tokens (more secure)
   - Or use secure storage mechanisms
   - Clear tokens on logout

5. **Password Policy**
   - Enforce strong passwords
   - Consider password complexity rules
   - Implement password reset flow

## Next Steps

1. **Add Password Reset**
   - Forgot password endpoint
   - Email verification
   - Reset token generation

2. **Add Email Verification**
   - Verify email on registration
   - Resend verification email
   - Block unverified users

3. **Add OAuth Integration**
   - Google OAuth
   - GitHub OAuth
   - Social login options

4. **Add Role-Based Access Control (RBAC)**
   - User roles (admin, customer, etc.)
   - Permission guards
   - Role-based endpoints

5. **Add Rate Limiting**
   - Throttle auth endpoints
   - Prevent abuse
   - Use @nestjs/throttler

6. **Add Refresh Token Rotation**
   - Store refresh tokens in database
   - Implement token rotation
   - Revoke compromised tokens

7. **Add Logging and Monitoring**
   - Log authentication attempts
   - Monitor failed logins
   - Alert on suspicious activity

8. **Add Two-Factor Authentication (2FA)**
   - TOTP support
   - SMS verification
   - Backup codes

## Dependencies Installed

```json
{
  "dependencies": {
    "@nestjs/jwt": "^10.x",
    "@nestjs/passport": "^10.x",
    "bcrypt": "^5.x",
    "class-validator": "^0.14.x",
    "class-transformer": "^0.5.x",
    "passport": "^0.7.x",
    "passport-jwt": "^4.x"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.x",
    "@types/passport-jwt": "^4.x",
    "@types/supertest": "^6.x",
    "supertest": "^6.x"
  }
}
```

## Troubleshooting

### Common Issues

1. **"User not found" error**
   - Ensure database is running
   - Check DATABASE_URL in .env
   - Run `npx prisma generate`

2. **"Invalid token" error**
   - Check JWT_SECRET matches
   - Verify token hasn't expired
   - Ensure Bearer prefix in header

3. **Validation errors**
   - Check DTO requirements
   - Verify email format
   - Check password length

4. **CORS errors**
   - Update FRONTEND_URL in .env
   - Check CORS configuration in main.ts

## Support

For issues or questions:
1. Check the error logs
2. Review the test suite
3. Consult NestJS documentation
4. Check Prisma documentation
