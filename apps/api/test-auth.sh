#!/bin/bash

API_URL="http://localhost:3000"

echo "Testing Auth Endpoints"
echo "======================"
echo ""

# Test 1: Register
echo "1. Testing POST /auth/register"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User"
  }')

echo "Response: $REGISTER_RESPONSE"
ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)
echo ""

# Test 2: Login
echo "2. Testing POST /auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }')

echo "Response: $LOGIN_RESPONSE"
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo ""

# Test 3: Get Profile
echo "3. Testing GET /auth/profile (protected)"
PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/auth/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Response: $PROFILE_RESPONSE"
echo ""

# Test 4: Refresh Token
echo "4. Testing POST /auth/refresh"
REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }")

echo "Response: $REFRESH_RESPONSE"
echo ""

# Test 5: Invalid Login
echo "5. Testing POST /auth/login with invalid credentials"
INVALID_LOGIN=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }')

echo "Response: $INVALID_LOGIN"
echo ""

# Test 6: Protected route without token
echo "6. Testing GET /auth/profile without token"
NO_TOKEN_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$API_URL/auth/profile")
echo "Response: $NO_TOKEN_RESPONSE"
echo ""

echo "======================"
echo "All tests completed!"
