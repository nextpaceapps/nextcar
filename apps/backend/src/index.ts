import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { db } from './config/firebase';

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        process.env.ADMIN_ORIGIN || 'http://localhost:5174',
        process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
    res.send('NextCar Backend is running');
});

import vehiclesRoutes from './routes/vehicles';
import adminVehiclesRoutes from './routes/adminVehicles';
import adminCustomersRoutes from './routes/adminCustomers';
import aiRoutes from './routes/ai';
import healthRoutes from './routes/health';
import { errorHandler } from './middleware/error';

// Mount routes
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/admin/vehicles', adminVehiclesRoutes);
app.use('/api/admin/customers', adminCustomersRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);

// Register the catch-all error handler at the end of the middleware chain
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
