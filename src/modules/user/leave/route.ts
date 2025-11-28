import { Router } from "express";
import { authMiddelware } from "../../../middlewares/auth";
import { ipAddressMiddleware } from "../../../middlewares/ip";
import { logLeaves, requestLeave } from "./controller";

const router = Router()

//POST
router.post("/add/leave", authMiddelware, ipAddressMiddleware, requestLeave);
//GET
router.post("/leaves", authMiddelware, ipAddressMiddleware, logLeaves);

export default router;