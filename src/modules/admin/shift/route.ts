import { Router } from "express";
import { validate } from "../../../middlewares/validate";
import { createShiftSchema } from "./validate";
import { createShift } from "./controller";
import { authMiddelware } from "../../../middlewares/auth";
import { roleMiddleware } from "../../../middlewares/role";
import { Role } from "../../../types/jwt";


const router = Router();

//POST
router.post('/create',
    authMiddelware,
    roleMiddleware(Role.ADMIN),
    validate(createShiftSchema),
    createShift
);

export default router;