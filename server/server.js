const http = require('http');
const ioServer = require('socket.io');
const redisClient = require('./src/utils/redisClient');
const app = require('./app');
const mongoConnect = require('./src/config/mongo');
const socketManager = require('./socketManager');
require('dotenv').config();

// Create server from express app
const server = http.createServer(app);
const io = ioServer(server, { cors: { origin: "*" } });
socketManager(io);

async function startServer() {
    // Connect to Mongo
    await mongoConnect();
    // Connect to redis
    await redisClient.connect();
    server.listen(3001, () => {
        console.log('Server started running...');
    });
}

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
