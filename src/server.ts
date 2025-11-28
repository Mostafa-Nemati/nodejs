import app from './app';
import config from './config/config';
//import './crons';

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
})