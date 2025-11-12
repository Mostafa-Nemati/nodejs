import { Router } from "express";
import { validate } from "../../../middlewares/validate";
import { registerSchema } from "./validator";
import { loginAdmin, registerAdmin } from "./controller";


const router = Router();

router.post('/admin/register', validate(registerSchema), registerAdmin);
router.post('/admin/login', loginAdmin);


export default router;