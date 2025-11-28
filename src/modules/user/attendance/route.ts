import { Router } from "express";
import { authMiddelware } from "../../../middlewares/auth";
import { checkIn, checkOut, history } from "./controller";
import { ipAddressMiddleware } from "../../../middlewares/ip";

const router = Router();

//POST
router.post("/check-in", authMiddelware, ipAddressMiddleware, checkIn);
router.post("/check-out", authMiddelware, ipAddressMiddleware, checkOut);

//GET
router.get('/history', authMiddelware, ipAddressMiddleware, history)

export default router;