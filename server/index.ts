import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, getDatabaseStatus } from './config/db';
import { config } from './config/environment';
import { getGatewayConfig } from './services/razorpayService';

// Import Routes
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';
import showtimeRoutes from './routes/showtimeRoutes';
import pricingRoutes from './routes/pricingRoutes';
import offerRoutes from './routes/offerRoutes';
import bookingRoutes from './routes/bookingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import ticketRoutes from './routes/ticketRoutes';
import contactRoutes from './routes/contactRoutes';
import statsRoutes from './routes/statsRoutes';

// Middlewares
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = config.port || 5000;

// CORS setup
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const dbStatus = getDatabaseStatus();
  res.json({
    status: 'healthy',
    theatre: 'Babu Cinemas - Multi-Screen Cinema Complex',
    version: '3.0.0',
    database: {
      provider: dbStatus.provider,
      connected: dbStatus.connected,
      host: dbStatus.host,
      databaseName: dbStatus.dbName,
    },
    paymentGateway: getGatewayConfig(),
    timestamp: new Date().toISOString(),
  });
});

// Mount API Modules
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server and Connect Database
async function startServer() {
  try {
    const dbStatus = await connectDatabase();

    app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🎬 BABU CINEMAS BACKEND API IS RUNNING ON PORT ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
      console.log(`🗄️ Database: ${dbStatus.provider} (${dbStatus.host}/${dbStatus.dbName})`);
      console.log(`💳 Payment Gateway: ${getGatewayConfig().mode} (Key: ${getGatewayConfig().keyId})`);
      console.log('====================================================');
    });
  } catch (error: any) {
    console.error('❌ Failed to start Babu Cinemas server:', error.message);
    process.exit(1);
  }
}

startServer();
