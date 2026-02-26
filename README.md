# 🚀 TMPVL Backend

Production-ready Node.js + Express + PostgreSQL backend  
Built for TMPVL Employee Portal.

---

## 📌 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Bcrypt
- Docker (optional)

---

## 📂 Project Structure

src/ ├── config/ ├── middlewares/ ├── modules/ │    ├── auth/ │    ├── attendance/ │    ├── leave/ │    ├── salary/ ├── sockets/ ├── utils/ ├── routes.js ├── server.js

---

## ⚙️ Setup Instructions (For Dev)

### 1️⃣ Clone the Repository

https://github.com/Tox1C-2x/tmpvl-backend.github

 cd tmpvl-backend
 
 ---

### 2️⃣ Install Dependencies

npm install 

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in root directory.

Example:
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/tmpvl
JWT_SECRET=your_secret_key

---

### 4️⃣ Run Database

Make sure PostgreSQL is running locally.

Create database:

CREATE DATABASE tmpvl;

---

### 5️⃣ Start Development server

npm run Dev
or 
npm start

Server will run on:
http://localhost:3000

---

## 🔐 Authentication Flow

1. Register
2. Verify OTP
3. Set Password
4. Login
5. Receive JWT Token

---

## 📡 API Base URL
http://localhost:3000/api

---

## 🐳 Docker Setup (Optional)
docker-compose up --build

---

## 🧪 Testing

Use Postman or Thunder Client to test APIs.

---

## 👨‍💻 Contribution Guide

1. Create a new branch
git checkout -b feature/your-feature-name

2. Make changes
3. Commit
git commit -m "Add: feature description"
4. Push
git push origin feature/your-feature-name

5. Create Pull Request

---

## 🔒 Security Notes

- Do not commit `.env`
- Use environment variables for secrets
- Never expose JWT_SECRET

---

## 📜 License

This project is proprietary and maintained by TMPVL Team.
