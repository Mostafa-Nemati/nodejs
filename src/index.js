require('dotenv').config();
require('express-async-errors');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;

(async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start', err);
        process.exit(1);
    }
})();