import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import './config/subscriber';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`User Service is running on port ${PORT}`);
});