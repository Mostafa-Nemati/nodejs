import { Router } from "express";
import { validate } from "../../../middlewares/validate";
import { createShiftSchema } from "./validate";
import { createShift } from "./controller";


const router = Router();

//POST
router.post('/admin/shift', validate(createShiftSchema), createShift);


export default router;