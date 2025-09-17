import express from "express";
import todoRoutes from "./routes/todo.routes";
import userRoutes from './routes/user.routes';
import { errorHandler } from "./middlewares/errorHandler";
import multer from 'multer';
import cors from 'cors';
import helmet from "helmet";

const upload = multer();
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: 'https://example.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorizaion']
}))

app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// for form-data
app.use(upload.none());

//Routes
app.use('/api/user/todo', todoRoutes);
app.use('/api/user', userRoutes)


// Global error handler (should be after routes)
app.use(errorHandler);

export default app