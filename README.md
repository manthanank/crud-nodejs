# CRUD nodejs

## Using MongoDB

```js
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
```

```js
// routes/todoRoutes.js
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

```js
// models/todo.js
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

```js
// middleware/errorMiddleware.js
module.exports = function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};
```

```js
// controllers/todoController.js
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

```js
// config/database.js
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

```js
// .env.example
PORT=3000

CLIENT_URL=http://localhost:3000

MONGODB_USER=your_mongodb_user
MONGODB_PASSWORD=your_mongodb_password
MONGODB_DBNAME=crud
```

```js
// package.json
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

## Using MySQL

```js
// index.js
const express = require('express');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todoRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/todos', todoRoutes);

// Error middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

```js
// routes/todoRoutes.js
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

```js
// models/todo.js
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

```js
// middleware/errorMiddleware.js
module.exports = function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};
```

```js
// controllers/todoController.js
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

```js
// config/database.js
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

```js
// .env.example
PORT=3000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_DATABASE=your_database
```

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
