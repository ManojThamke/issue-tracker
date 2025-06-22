const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const protect = require('./middleware/authMiddleware');
const projectRoutes = require('./routes/projectRoutes');
const ticketRoutes = require("./routes/ticketRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// connect to DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Route

app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
    res.send('API is working');
});
app.get('/api/protected', protect, (req, res) => {
    res.json({message: 'This is protected data', user: req.user});
});
app.use('/api/projects', projectRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});