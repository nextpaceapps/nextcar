import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initSentry } from './lib/sentry';

dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

initSentry();

const app = express();

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

import adminVehiclesRoutes from './routes/adminVehicles';
import adminCustomersRoutes from './routes/adminCustomers';
import adminOpportunitiesRoutes from './routes/adminOpportunities';
import adminUsersRoutes from './routes/adminUsers';
import aiRoutes from './routes/ai';
import healthRoutes from './routes/health';
import { errorHandler } from './middleware/error';

// Mount routes
app.use('/api/admin/vehicles', adminVehiclesRoutes);
app.use('/api/admin/customers', adminCustomersRoutes);
app.use('/api/admin/opportunities', adminOpportunitiesRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);

// Register the catch-all error handler at the end of the middleware chain
app.use(errorHandler);

export default app;
