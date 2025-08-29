const Todo = require('../models/todo.model');

async function createTodo(data) {
    return Todo.create(data);
}

async function getTodos({ page= 1, limit= 10, completed, q, sortBy= '-createAt', user}) {
    const filter = {user};
    if(completed !== undefined) filter.completed = completed === 'true';
    if(q) filter.$or = [
        { title: { $regex: q, $option: 'i' }},
        { description: { $regex:q, $option: 'i' } },
    ];

    const skip = (Number(page) - 1) * Number(limit);    
    const [items, total] = await Promise.all([
        Todo.find(filter).sort(sortBy).skip(skip).limit(Number(limit)),
        Todo.countDocuments(filter)
    ]);
    return { items, total, page: Number(page), limit: Number(limit) };
}

async function getTodoById(id) {
    return Todo.findById(id);
}

async function updateTodo(id, data) {
    return Todo.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteTodo(id) {
    return Todo.findByIdAndDelete(id);
}

module.exports = {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo
};