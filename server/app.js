const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRouter = require('./src/routes/auth/auth.route');
const chatRoomRouter = require('./src/routes/chatRoom/chatRoom.route');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));

app.use(express.json());

app.get('/health', (req, res) => res.send('OK'));

app.use('/auth', authRouter);
app.use('/api', chatRoomRouter);

// Error handling middleware (production-safe)
app.use((err, req, res, next) => {
    console.error(err);
    const message = process.env.NODE_ENV === 'production'
        ? 'An error occurred.'
        : err.message || 'Internal server error';
    res.status(err.status || 500).json({ message });
});

module.exports = app;