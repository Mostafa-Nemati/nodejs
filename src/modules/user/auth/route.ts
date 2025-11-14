import { Router } from "express";
import { validate } from "../../../middlewares/validate";
import { loginSchema, registerSchema } from "./validator";
import { loginUser, registerUser } from "./controller";


const router = Router();

router.post('/register',
    validate(registerSchema),
    registerUser
);
router.post('/login',
    validate(loginSchema),
    loginUser
);

export default router;