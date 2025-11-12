import express from "express";
import todoRoutes from "./routes/todo.routes";
import userRoutes from './routes/user.routes';
import authRoutesAdmin from './modules/admin/auth/route';
import authRoutesUser from './modules/user/auth/route';
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
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// for form-data
app.use(upload.none());


//Routes Admin
app.use('/api/admin/auth', authRoutesAdmin);

//Routes User
app.use('/api/user/auth', authRoutesUser);



// Global error handler (should be after routes)
app.use(errorHandler);

export default app