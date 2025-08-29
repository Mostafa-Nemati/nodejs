const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todo.routes');
const userRoutes = require('./routes/user.routes');
const errorHandlre = require('./middleware/errorHandler');
const multer = require('multer');
const upload = multer();
const app = express();

app.use(cors());

app.use(express.json());

// for form-data
app.use(upload.none());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/user/todo', todoRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandlre);

module.exports = app;