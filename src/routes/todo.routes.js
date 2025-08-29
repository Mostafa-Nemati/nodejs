const express = require('express');
const router = express.Router();
const controller = require('../controllers/todo.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { createTodoSchema, updateTodoSchema } = require('../validators/todo.validator');

router.use(auth);


// GET /api/todos
router.get('/', controller.listTodos);

// POST /api/todos
router.post('/', validate(createTodoSchema), controller.createTodo);

// GET /api/todos/:id
router.get('/:id', controller.getTodo);

// PUT /api/todos/:id
router.put('/:id', validate(updateTodoSchema), controller.updateTodo);

// DELETE /api/todos/:id
router.delete('/:id', controller.removeTodo);

module.exports = router;