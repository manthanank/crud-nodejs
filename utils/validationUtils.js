// utils/validationUtils.js
module.exports.validateTodo = function(todo) {
    if (!todo.title) {
        return false;
    }
    return true;
};