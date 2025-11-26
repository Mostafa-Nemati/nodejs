import { Router } from "express";
import { validate } from "../../../middlewares/validate";
import { loginSchema, registerSchema } from "./validator";
import { loginUser, registerUser } from "./controller";
import { ipAddressMiddleware } from "../../../middlewares/ip";


const router = Router();

router.post('/register',
    validate(registerSchema),
    registerUser
);
router.post('/login',
    ipAddressMiddleware,
    validate(loginSchema),
    loginUser
);

export default router;