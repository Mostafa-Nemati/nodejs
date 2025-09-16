import express from "express";
import todoRoutes from "./routes/todo.routes";
import userRoutes from './routes/user.routes';
import { errorHandler } from "./middlewares/errorHandler";
import multer from 'multer';
import cors from 'cors';

const upload = multer();
const app = express();

app.use(cors());

app.use(express.json());

// for form-data
app.use(upload.none());

//Routes
app.use('/api/user/todo', todoRoutes);
app.use('/api/user', userRoutes)


// Global error handler (should be after routes)
app.use(errorHandler);

export default app