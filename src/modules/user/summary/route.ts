import { Router } from "express";
import { authMiddelware } from "../../../middlewares/auth";
import { ipAddressMiddleware } from "../../../middlewares/ip";
import { summary } from "./controller";


const router = Router()

router.get("/summary", authMiddelware, ipAddressMiddleware, summary);

export default router;