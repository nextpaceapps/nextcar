import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { db } from './config/firebase';

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.ADMIN_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
    res.send('NextCar Backend is running');
});

import carRoutes from './routes/cars';
import aiRoutes from './routes/ai';

// Mount routes
app.use('/api/cars', carRoutes);
app.use('/api/ai', aiRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
