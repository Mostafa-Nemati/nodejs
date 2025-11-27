import { Router } from "express";
import { authMiddelware } from "../../../middlewares/auth";
import { ipAddressMiddleware } from "../../../middlewares/ip";
import { wallet } from "./controller";


const router = Router();

router.get('/wallet', authMiddelware, ipAddressMiddleware, wallet);

export default router