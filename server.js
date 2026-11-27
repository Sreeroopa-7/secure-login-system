
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

// Create Express application FIRST
const app = express();
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));
// Import authentication routes
const authRoutes = require('./routes/auth');
console.log('Auth routes loaded:', typeof authRoutes);

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 30
    }
}));

// Protect dashboard page
app.get('/dashboard.html', (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login.html');
    }
    next();
});

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Authentication routes
app.use('/api/auth', authRoutes);

// Database connection
const db = require('./db');

async function connectDB() {
    try {
        const connection = await db.getConnection();

        console.log('MySQL Connected Successfully!');

        connection.release();

    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}

// Start server
async function startServer() {
    await connectDB();

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
}

startServer();
