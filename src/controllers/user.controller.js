const userService = require('../services/user.services');
const createError = require('http-errors');

async function createUser (req, res) {
    const user = await userService.createUser(req.body);
    return res.status(201).json({ data: user });
}

async function signin(req, res) {
   const { user, verifyCode } = await userService.signin(req.body);
   return res.json({ message: 'login successfully', user, verifyCode })
}

async function verifyUser(req, res) {
    const { id, verifyCode } = req.body;
   
    if(!id || !verifyCode) createError(400, 'ID and verify code required');
    const { user, token } = await userService.verifyUser(id, verifyCode);
    return res.json({ message: 'User verified successfully', user, token });
}

module.exports = {
    createUser,
    verifyUser,
    signin
}