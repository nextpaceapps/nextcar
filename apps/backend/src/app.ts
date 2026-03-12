import './bootstrap';
import express from 'express';
import cors from 'cors';
import { Sentry } from './lib/sentry';

const app = express();

app.use(cors({
    origin: [
        process.env.ADMIN_ORIGIN || 'http://localhost:5174',
        process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'sentry-trace', 'baggage'],
    credentials: true
}));
app.use((req, res, next) => {
    const sentryTrace = req.header('sentry-trace');
    const baggage = req.header('baggage');

    Sentry.continueTrace({ sentryTrace, baggage }, () => {
        Sentry.startSpanManual(
            {
                name: `${req.method} ${req.path}`,
                op: 'http.server',
                forceTransaction: true,
                attributes: {
                    'http.request.method': req.method,
                    'http.route': req.path,
                    'url.full': `${req.protocol}://${req.get('host')}${req.originalUrl}`,
                },
            },
            (span) => {
                res.on('finish', () => {
                    span.setAttribute('http.response.status_code', res.statusCode);
                    span.end();
                });
                next();
            },
        );
    });
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
