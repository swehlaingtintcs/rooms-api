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
npm run dev
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


