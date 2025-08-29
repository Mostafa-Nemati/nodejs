const User = require('../models/user.model');
const Jwt = require('jsonwebtoken');


async function createUser(data) {
    const user = await User.create(data);

    const verifyCode = Math.floor(100000 + Math.random() * 900000);
    
    user.verifyCode = verifyCode;
    await user.save();

    return { user, verifyCode }
}

async function signin(data) {
    const user = await User.findOne(data)

    if(!user) throw new Error('User not fonnd');
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyCode = verifyCode;
    await user.save();

    return { user, verifyCode }
}


async function verifyUser(id, code) {
    const user = await User.findById(id);
    
    if(!user) throw new Error('User not found');
    if(user.isVerified) throw new Error('User already verified');
    if(user.verifyCode !== code) throw new Error('invalid verification code');

    user.isVerified = true;
    user.verifyCode = null;
    await user.save();

    const token = Jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'fallbackSecretKey',
        { expiresIn: '7d' }
    );

    return { token }
}

module.exports = {
    createUser,
    verifyUser,
    signin
}