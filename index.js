const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

// Routes
app.use("/todos", todoRoutes);

// Error middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
