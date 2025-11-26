import { Router } from "express";
import { ipAddressMiddleware } from "../../../middlewares/ip";
import { authMiddelware } from "../../../middlewares/auth";
import { infoDashbaord } from "./controller";



const router = Router();

router.get('/dashboard', authMiddelware, ipAddressMiddleware, infoDashbaord);

export default router;