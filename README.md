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
