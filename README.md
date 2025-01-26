# CRUD Nodejs

## Table of Contents

1. CRUD Application with Node.js, Express, and MongoDB.
2. CRUD Application with Node.js, Express, and MySQL.

## CRUD Application with Node.js, Express, and MongoDB

## Project Setup for MySQL

### Step 1: Setting Up the Project

First, create a new directory for your project and initialize it with npm:

```bash
mkdir crud-nodejs
cd crud-nodejs
npm init -y
```

Next, install the necessary dependencies:

```bash
npm install express mongoose cors dotenv body-parser
npm install --save-dev nodemon
```

Create the following project structure:

```text
crud-nodejs
├── config
│   └── database.js
├── controllers
│   └── todoController.js
├── middleware
│   └── errorMiddleware.js
├── models
│   └── todo.js
├── routes
│   └── todoRoutes.js
├── .env.example
├── index.js
└── package.json
```

### Step 2: Configuring Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Fill in your MongoDB credentials in the `.env` file:

```js
PORT=3000

CLIENT_URL=http://localhost:3000

MONGODB_USER=your_mongodb_user
MONGODB_PASSWORD=your_mongodb_password
MONGODB_DBNAME=crud
```

### Step 3: Connecting to MongoDB

In `config/database.js`, we set up the MongoDB connection using Mongoose:

```js
const mongoose = require('mongoose');

require('dotenv').config();

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DBNAME || 'crud';

const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.re3ha3x.mongodb.net/${dbName}?retryWrites=true&w=majority`;

module.exports = async function connectDB() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed');
        console.error(error);
    }
};
```

### Step 4: Creating the Express Server

In `index.js`, we configure the Express server and connect to MongoDB:

```js
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
```

### Step 5: Defining the Todo Model

In `models/todo.js`, we define the Todo schema using Mongoose:

```js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Todo', todoSchema);
```

### Step 6: Creating the Controller

In `controllers/todoController.js`, we define the logic for handling CRUD operations:

```js
const Todo = require('../models/todo');
const { validateTodo } = require('../utils/validationUtils');

exports.createTodo = async (req, res) => {
    const todo = req.body;

    if (!validateTodo(todo)) {
        return res.status(400).json({ message: 'Invalid todo object' });
    }

    try {
        const newTodo = new Todo(todo);
        await newTodo.save();
        res.status(201).json({ message: 'Todo created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.send(todos);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).send('Todo not found');
        res.send(todo);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todo) return res.status(404).send('Todo not found');
        res.status(200).send({ message: 'Todo updated successfully'});
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).send('Todo not found');
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
};
```

### Step 7: Defining Routes

In `routes/todoRoutes.js`, we set up the routes for the Todo API:

```js
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// Routes
router.post('/', todoController.createTodo);
router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.patch('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
```

### Step 8: Error Handling Middleware

In `middleware/errorMiddleware.js`, we define a simple error handling middleware:

```js
// middleware/errorMiddleware.js
module.exports = function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};
```

### Step 9: Running the Application

Add the following scripts to `package.json`:

```js
{
  "name": "crud-nodejs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon index.js",
    "start": "node index.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/manthanank/crud-nodejs.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/manthanank/crud-nodejs/issues"
  },
  "homepage": "https://github.com/manthanank/crud-nodejs#readme",
  "dependencies": {
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mongoose": "^8.3.2",
    "nodemon": "^3.1.0"
  }
}
```

Start the application in development mode:

```bash
npm run dev
```

## CRUD Application with Node.js, Express, and MySQL

## Project Setup for MongoDB

### Step 1: Initializing the Project

Create a new directory for your project and initialize it with npm:

```bash
mkdir crud-nodejs
cd crud-nodejs
npm init -y
```

Install the necessary dependencies:

```bash
npm install express mysql2 dotenv body-parser
npm install --save-dev nodemon
```

### Step 2: Project Structure

Create the following project structure:

```text
crud-nodejs
├── config
│   └── database.js
├── controllers
│   └── todoController.js
├── middleware
│   └── errorMiddleware.js
├── models
│   └── todo.js
├── routes
│   └── todoRoutes.js
├── .env.example
├── index.js
└── package.json
```

### Step 3: Configuring Environment Variables

Create a `.env` file (copy from `.env

.example`):

```bash
cp .env.example .env
```

Fill in your MySQL database credentials in the `.env` file:

```js
PORT=3000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_DATABASE=your_database
```

### Step 4: Connecting to MySQL

In `config/database.js`, we set up the MySQL connection using the `mysql2` package:

```js
const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = connection;
```

### Step 5: Creating the Express Server

In `index.js`, we configure the Express server and set up the routes and error handling middleware:

```js
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
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
app.use(helmet());
app.use(morgan('common'));

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
```

### Step 6: Defining the Todo Model

In `models/todo.js`, we define the functions to interact with the MySQL database:

```js
const db = require('../config/database');

exports.getAllTodos = function(callback) {
    db.query('SELECT * FROM todos', callback);
};

exports.getTodoById = function(id, callback) {
    db.query('SELECT * FROM todos WHERE id = ?', [id], callback);
};

exports.createTodo = function(newTodo, callback) {
    db.query('INSERT INTO todos SET ?', newTodo, callback);
};

exports.updateTodo = function(id, updatedTodo, callback) {
    db.query('UPDATE todos SET ? WHERE id = ?', [updatedTodo, id], callback);
};

exports.deleteTodo = function(id, callback) {
    db.query('DELETE FROM todos WHERE id = ?', [id], callback);
};
```

### Step 7: Creating the Controller

In `controllers/todoController.js`, we define the logic for handling CRUD operations:

```js
const Todo = require('../models/todo');

exports.getAllTodos = function(req, res) {
    Todo.getAllTodos((err, todos) => {
        if (err) throw err;
        res.json(todos);
    });
};

exports.getTodoById = function(req, res) {
    Todo.getTodoById(req.params.id, (err, todo) => {
        if (err) throw err;
        res.json(todo);
    });
};

exports.createTodo = function(req, res) {
    const newTodo = {
        title: req.body.title,
        completed: req.body.completed
    };

    Todo.createTodo(newTodo, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Todo created successfully'});
    });
};

exports.updateTodo = function(req, res) {
    const updatedTodo = {
        title: req.body.title,
        completed: req.body.completed
    };

    Todo.updateTodo(req.params.id, updatedTodo, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Todo updated successfully' });
    });
};

exports.deleteTodo = function(req, res) {
    Todo.deleteTodo(req.params.id, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Todo deleted successfully' });
    });
};
```

### Step 8: Defining Routes

In `routes/todoRoutes.js`, we set up the routes for the Todo API:

```js
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// Routes
router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
```

### Step 9: Error Handling Middleware

In `middleware/errorMiddleware.js`, we define a simple error handling middleware:

```js
module.exports = function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};
```

### Step 10: Running the Application

Add the following scripts to `package.json`:

```js
{
  "name": "crud-nodejs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon index.js",
    "start": "node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.20.2",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mysql2": "^3.9.7",
    "nodemon": "^3.1.0"
  }
}
```

Start the application in development mode:

```bash
npm run dev
```
