# Rooms Api 
Rooms API is a RESTful backend service that allows users to create, update, and delete room listings with secure authentication and authorization. 

Built with Node.js, Express, SQLite, and JWT authentication with full request validation and integration tests using Jest + Supertest. 

---

## Features 
- User authentication (register / login) using JWT 
- Protected routes with middleware-based authentication 
- Owner-only authorization for updating and deleting rooms 
- Input validation for params, query, and body 
- Centralized error handling 
- Pagination, filtering, and search for rooms 
- Security middleware using Helmet and rate limiting 
- Integration tests with Jest + Supertest 

--- 

## Project Structure 
- `routes/` - API route definitions 
- `middleware/` – auth, validation, error handling
- `db/` – SQLite database logic
- `tests/` – integration tests
- `validators/` – request validation schemas

---

## Tech Stack 
- Node.js 
- Express
- SQLite 
- jsonwebtoken (JWT) 
- bcrypt 
- Jest + Supertest 
- Helmet 
- express-rate-limit 

---

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/swehlaingtintcs/rooms-api.git
cd rooms-api
```
### 2. Install dependencies
```bash
npm install
```
### 3. Create a .env file in the project root 
```env
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```
### 4. Start the server
```bash
node server.js
```


---

##  API Endpoints 
### Auth 
- POST `/auth/register` 
- POST `/auth/login`
- GET `/auth/me`
### Rooms 
- GET `/rooms`
- GET `/rooms/:id`
- POST `/rooms` (auth required)
- PUT `/rooms/:id` (owner only)
- PATCH `/rooms/:id` (owner only)
- DELETE `/rooms/:id` (owner only)

---

## Testing 
Run integration tests using Jest and Supertest: 
```bash 
npm test
```

--- 

## Example Usage (curl) 
All examples assume the server is running on `http://localhost:3000`
### Get all rooms 
```bash 
curl -X GET http://localhost:3000/rooms
```
### Register a user 
```bash 
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json"  \ 
-d '{"email": "swe@mail.com","password":"password1234"}'
```
### Login and receive JWT 
```bash 
curl -X POST http://localhost:3000/auth/login \ 
-H "Content-Type: application/json" \ 
-d '{"email":"swe@mail.com","password":"password1234"}' 
```
### Get current authenticated user 
```bash
curl -X GET http://localhost:3000/auth/me \ 
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```
### Create a room 
```bash 
curl -X POST http://localhost:3000/rooms \ 
-H "Authorization: Bearer YOUR_JWT_TOKEN" \ 
-H "Content-Type: application/json" \
-d '{"title":"Lincoln Hall","pricePerNight":1200}'
```
### Update a room 
```bash
curl -X PATCH http://localhost:3000/rooms/1 \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{"pricePerNight": 1350}'
```
### Delete a room
```bash
curl -X DELETE http://localhost:3000/rooms/1 \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```



