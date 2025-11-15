import { Router } from "express";
import { authMiddelware } from "../../../middlewares/auth";
import { roleMiddleware } from "../../../middlewares/role";
import { Role } from "../../../types/jwt";
import { checkIn, checkOut } from "./controller";


const router = Router();



//POST
router.post("/check-in", authMiddelware, roleMiddleware(Role.USER), checkIn);
router.post("/check-out", authMiddelware, roleMiddleware(Role.USER), checkOut);

export default router;