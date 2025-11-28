import { Router } from "express";
import { authMiddelware } from "../../../middlewares/auth";
import { ipAddressMiddleware } from "../../../middlewares/ip";
import { profile } from "./controller";

const router = Router();

router.get("/profile", authMiddelware, ipAddressMiddleware, profile);

export default router