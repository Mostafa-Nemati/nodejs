const mongoose = require('mongoose');

async function connectDB(uri) {
    await mongoose.connect(uri);
    console.log('MogoDB connect');
}
module.exports = connectDB;