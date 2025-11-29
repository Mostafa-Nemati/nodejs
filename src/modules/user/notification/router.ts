import { Router } from "express";
import { authMiddelware } from "../../../middlewares/auth";
import { ipAddressMiddleware } from "../../../middlewares/ip";
import { notification } from "./controller";

const router = Router()

router.get("/notification/log", authMiddelware, ipAddressMiddleware, notification)

export default router;