const rateLimit = require('express-rate-limit');
const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const db = require('../db');
const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
// Login rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
router.get('/test', (req, res) => {
    res.send('Auth route is working!');
});

// Registration validation
const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().max(150).required(),
    password: Joi.string().min(8).max(72).required()
});

// REGISTER ROUTE
router.post('/register', async (req, res) => {

    try {
        // Validate user input
        const { error, value } = registerSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const { name, email, password } = value;
        const normalizedEmail = email.toLowerCase();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Store user in database
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, normalizedEmail, hashedPassword]
        );

        return res.status(201).json({
            message: 'Registration successful!',
            userId: result.insertId
        });

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Email already registered!'
            });
        }

        console.error('Registration error:', error.message);

        return res.status(500).json({
            message: 'Something went wrong. Please try again.'
        });
    }
});
// Login validation
const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required()
});
// LOGIN ROUTE
router.post('/login', loginLimiter, async (req, res) => {
    try {
        // Validate input
        const { error, value } = loginSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const { email, password } = value;
        const normalizedEmail = email.toLowerCase();

        // Find user in database
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password!'
            });
        }

        const user = users[0];

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password!'
            });
        }

        // Create login session
        return req.session.regenerate((err) => {
            if (err) {
                console.error('Session regeneration error:', err.message);
                return res.status(500).json({
                    message: 'Login failed. Please try again.'
                });
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err.message);
                    return res.status(500).json({
                        message: 'Login failed. Please try again.'
                    });
                }

                return res.status(200).json({
                    message: 'Login successful!',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            });
        });

    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(500).json({
            message: 'Something went wrong. Please try again.'
        });
    }
});
// PROTECTED DASHBOARD ROUTE
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.status(200).json({
        message: 'Welcome to your dashboard!',
        user: req.session.user
    });
});

// LOGOUT ROUTE
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err.message);

            return res.status(500).json({
                message: 'Logout failed. Please try again.'
            });
        }

        res.clearCookie('connect.sid');

        return res.status(200).json({
            message: 'Logout successful!'
        });
    });
});

module.exports = router;
