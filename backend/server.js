// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const passport = require('passport');

// Load Passport configuration (includes Google strategy)
require('./config/passport');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Passport middleware
app.use(passport.initialize());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // e.g., http://localhost:3000
    methods: ['GET', 'POST'],
  },
});
app.set('io', io);

// Listen for socket connections and allow joining rooms
io.on('connection', (socket) => {
  console.log('Client connected: ' + socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  // New: join user room for notifications
  socket.on('joinUserRoom', (userId) => {
    socket.join(userId.toString());
    console.log(`Socket ${socket.id} joined user room ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
  });
});

// Register routes
const traderRoutes = require('./routes/traderRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const followRoutes = require('./routes/followRoutes');
const commentVoteRoutes = require('./routes/commentVoteRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/traders', traderRoutes);
app.use('/auth', authRoutes);
app.use('/auth/profile', profileRoutes);
app.use('/users/follow', followRoutes);
app.use('/comments', commentVoteRoutes);
app.use('/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
