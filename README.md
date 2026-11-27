
# Secure Login System

A secure user authentication web application developed using Node.js, Express.js and MySQL.

## Features

- User Registration
- User Login and Logout
- Password Hashing using bcrypt
- Input Validation using Joi
- Session-based Authentication
- Protected Dashboard
- Login Rate Limiting
- SQL Injection Protection
- Secure HTTP Headers using Helmet

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MySQL
- bcrypt
- Joi
- Express Session
- Helmet

## Project Structure

```text
secure-login-system/
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   └── auth.js
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── style.css
│   └── JavaScript files
│
├── db.js
├── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sreeroopa-7/secure-login-system.git
```

### 2. Open the project folder

```bash
cd secure-login-system
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file using `.env.example` as a reference.

Add your own MySQL credentials and session secret.

### 5. Create the MySQL database

```sql
CREATE DATABASE secure_login;
```

Create the users table:

```sql
USE secure_login;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Start the server

```bash
npm start
```

### 7. Open the application

http://localhost:3000

## Security Implementation

- Passwords are hashed before storing them in the database.
- Joi validates user input.
- Parameterized SQL queries help prevent SQL injection.
- Login attempts are rate-limited.
- Sessions are regenerated after successful login.
- Protected routes require authentication.
- Helmet adds security-related HTTP headers.

## Author

**Sree Roopa S J**

B.Tech Computer Science and Engineering

GitHub: [Sreeroopa-7](https://github.com/Sreeroopa-7)
