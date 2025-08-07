# Kaizen Authentication System

A simple, modern authentication system built with Node.js, Express.js, MongoDB (Atlas), EJS, and JWT. This project demonstrates how to set up secure user registration and login using the MVC pattern.

---

## 🚀 Features
- User registration (username, email, password, comment)
- Secure password hashing (bcrypt)
- JWT-based authentication (no sessions)
- Login/logout with HTTP-only cookies
- Protected dashboard route
- Modern, responsive EJS UI
- Input validation and helpful error popups

---

## 🛠️ How to Set Up & Run (from Scratch)

### 1. **Clone the Project**
```
git clone <your-repo-url>
cd Notes-Webapp-with-MongoDB
```

### 2. **Install Dependencies**
```
npm install
```

### 3. **Set Up Environment Variables**
- Copy `.env.example` to `.env` (or edit `.env` directly):
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_here
```
- Get your MongoDB Atlas URI from https://cloud.mongodb.com
- Choose a strong value for `JWT_SECRET` (any random string)

### 4. **Run the App in Development**
```
npm run dev
```
- The app uses `nodemon` for auto-reloading during development.
- Visit [http://localhost:5000](http://localhost:5000) in your browser.

---

## 🔑 Authentication Flow (Explained)

1. **Register**
   - Go to `/register`.
   - Fill out username, email, password, and (optionally) a comment.
   - If the email is not already registered, you’ll see a success message and be redirected to login.

2. **Login**
   - Go to `/login`.
   - Enter your email and password.
   - On success, a JWT is issued and stored in an HTTP-only cookie.
   - You are redirected to the dashboard.

3. **Dashboard**
   - The dashboard is a protected route.
   - If you are not logged in (no valid JWT), you will be redirected to login.
   - If logged in, you’ll see a personalized greeting.

4. **Logout**
   - Click the logout button to clear your JWT cookie and return to login.

---

## 📁 Project Structure
```
models/
  User.js           # Mongoose User model
controllers/
  authController.js # Registration, login, logout logic
routes/
  authRoutes.js     # Auth endpoints
views/
  register.ejs      # Registration form
  login.ejs         # Login form
  dashboard.ejs     # Dashboard page
server.js           # App entry, MongoDB connection, JWT middleware
.env                # Environment variables
```

---

## 📝 Notes
- All passwords are hashed before storage.
- JWT is used for stateless authentication (no sessions).
- MongoDB Atlas is recommended for cloud database hosting.
- All error and required field messages are shown as modern popups for a better user experience.

---

## 👥 For Your Friend: How to Implement This From Scratch
1. **Set up a new Node.js project and install dependencies:**
   - express, mongoose, ejs, bcrypt, dotenv, express-validator, jsonwebtoken, cookie-parser, nodemon
2. **Design your User model with Mongoose.**
3. **Create an auth controller for registration, login, logout.**
4. **Set up EJS views for register, login, and dashboard.**
5. **Configure JWT authentication and protect routes.**
6. **Use MongoDB Atlas for easy cloud database hosting.**
7. **Add input validation and user-friendly error popups.**
8. **Test the registration and login flow end-to-end.**

---

Feel free to fork, modify, and use this as a starting point for your own projects!