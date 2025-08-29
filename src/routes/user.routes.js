const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const validate = require('../middleware/validate');
const { createUserSchema, signinSchema } = require('../validators/user.validator');

//POST /api/signup
router.post('/signup', validate(createUserSchema), controller.createUser);

//POST api/signup/verify
router.post('/verify', controller.verifyUser)

//POST api/signin
router.post('/signin', validate(signinSchema), controller.signin)

module.exports = router;