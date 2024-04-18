// index.js
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const todoRoutes = require('./routes/todoRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: "*",
    })
);

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/todos', todoRoutes);

// Error middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
