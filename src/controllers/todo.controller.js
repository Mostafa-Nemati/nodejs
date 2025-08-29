const todoService = require('../services/todo.services');
const createError = require('http-errors'); // optional

async function createTodo(req, res) {
  const todo = await todoService.createTodo({ ...req.body, user:req.user.id });
  return res.status(201).json({ data: todo });
}

async function listTodos(req, res) {
  const result = await todoService.getTodos({ ...req.query, user:req.user.id });
  return res.json(result);
}

async function getTodo(req, res) {
  const todo = await todoService.getTodoById(req.params.id);
  if (!todo) throw createError(404, 'Todo not found');
  return res.json({ data: todo });
}

async function updateTodo(req, res) {
  const updated = await todoService.updateTodo(req.params.id, req.body);
  if (!updated) throw createError(404, 'Todo not found');
  return res.json({ data: updated });
}

async function removeTodo(req, res) {
  const removed = await todoService.deleteTodo(req.params.id);
  if (!removed) throw createError(404, 'Todo not found');
  return res.status(204).send();
}

module.exports = {
  createTodo,
  listTodos,
  getTodo,
  updateTodo,
  removeTodo
};