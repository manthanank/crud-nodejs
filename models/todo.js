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
