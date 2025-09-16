import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { userSchema } from '../validator/user.validator';
import { accountVerify, createUser, signinUser } from '../controllers/user.controller';

const router = Router();


//POST /api/user/add
router.post('/auth/signup', validate(userSchema), createUser);

//POST /api/user/auth/singin
router.post('/auth/signin', signinUser);

//POST /api/user/auth/verify/
router.post('/auth/verify', accountVerify);


export default router;