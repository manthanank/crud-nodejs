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
        res.status(201).json(newTodo);
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
        res.send(todo);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).send('Todo not found');
        res.send(todo);
    } catch (err) {
        res.status(500).send(err);
    }
};
