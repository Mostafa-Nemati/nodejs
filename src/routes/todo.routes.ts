import { Router } from 'express';
import { createTodo, deleteTodo, getTodoById, listTodos, updateTodo } from '../controllers/todo.controller';
import { validate } from '../middlewares/validate';
import { createTodoSchema } from '../validator/todo.validator';
import { auth } from '../middlewares/auth';

const router = Router();

router.use(auth);

//POST api/todos
router.post('/', validate(createTodoSchema), createTodo);

//GET api/todos
router.get('/', listTodos);

//GET api/todo/:id
router.get('/:id', getTodoById);

//PUT /api/todos/:id
router.put('/:id', validate(createTodoSchema), updateTodo);

//DELETE /api/todos/:id
router.delete('/:id', deleteTodo);

export default router;

