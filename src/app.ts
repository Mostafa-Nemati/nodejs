import express from "express";
import authRoutesAdmin from './modules/admin/auth/route';
import ipRoutesAdmin from './modules/admin/ip/route';
import shiftRoutesAdmin from './modules/admin/shift/route';
import authRoutesUser from './modules/user/auth/route';
import attendanceRoutesUser from './modules/user/attendance/route';
import dashboard from './modules/user/dashboard/route';
import leave from './modules/user/leave/route';
import wallet from './modules/user/wallet/route';
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
app.use('/api/admin/ip', ipRoutesAdmin);
app.use('/api/admin/shift', shiftRoutesAdmin);

//Routes User
app.use('/api/user/auth', authRoutesUser);
app.use('/api/user/attendance', attendanceRoutesUser);
app.use("/api/user", dashboard);
app.use("/api/user", wallet);
app.use("/api/user", leave);



// Global error handler (should be after routes)
app.use(errorHandler);

export default app