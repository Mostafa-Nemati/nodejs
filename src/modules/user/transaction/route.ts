import { Router } from "express";
import { authMiddelware } from "../../../middlewares/auth";
import { ipAddressMiddleware } from "../../../middlewares/ip";
import { transaction } from "./controller";

const router = Router()

router.get("/transaction/log", authMiddelware, ipAddressMiddleware, transaction)

export default router;