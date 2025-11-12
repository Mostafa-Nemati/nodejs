import { Router } from "express";
import { validate } from "../../../middlewares/validate";
import { registerSchema } from "./validator";
import { loginUser, registerUser } from "./controller";


const router = Router();

router.post('/user/register', validate(registerSchema), registerUser);
router.post('/user/login', loginUser);

export default router;