const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type:String, required: true, trim: true},
    lastName: { type:String, required: true, trim: true },
    phone: { type: String, required:true, trim: true, unique: true },
    gender: { type: String, enum: ['male', 'female'], default: 'male' },
    verifyCode: { type: String },
    isVerified : { type: Boolean, default: false }
}, {
    timestamps: true
});


module.exports = mongoose.model('User', userSchema)
