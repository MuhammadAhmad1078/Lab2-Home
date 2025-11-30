import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDatabase from './config/database';
import authRoutes from './routes/auth.routes';
import phlebotomistRoutes from './routes/phlebotomist.routes';
import testRoutes from './routes/test.routes';
import bookingRoutes from './routes/booking.routes';
import labRoutes from './routes/lab.routes';
import { errorHandler, notFound } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:5173', process.env.FRONTEND_URL || 'http://localhost:8080'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger with custom format
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('🌐 :method :url :status :response-time ms - :res[content-length]'));
} else {
    app.use(morgan('combined'));
}

// Connect to Database
connectDatabase();

// Health check route
app.get('/health', (req, res) => {
    console.log('✅ Health check requested');
    res.status(200).json({
        success: true,
        message: 'Lab2Home API is running! 🚀',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/phlebotomist', phlebotomistRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/labs', labRoutes);

// Error Handling Middleware
app.use(notFound); // 404 handler
app.use(errorHandler); // Global error handler

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🏥  Lab2Home Backend Server Running    ║
║                                           ║
║   Port: ${PORT}                          ║
║   Environment: ${process.env.NODE_ENV || 'development'}             ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
    console.log(`\n🎯 Available Endpoints:`);
    console.log(`   POST /api/auth/signup/patient`);
    console.log(`   POST /api/auth/signup/lab`);
    console.log(`   POST /api/auth/signup/phlebotomist (file → MongoDB)`);
    console.log(`   POST /api/auth/verify-otp`);
    console.log(`   POST /api/auth/resend-otp`);
    console.log(`   POST /api/auth/login (unified)`);
    console.log(`   GET  /api/auth/me (protected)`);
    console.log(`   GET  /api/phlebotomist/traffic-license (protected)`);
    console.log(`   GET  /api/phlebotomist/dashboard (protected)`);
    console.log(`   GET  /api/tests (public)`);
    console.log(`   GET  /api/tests/:id (public)`);
    console.log(`   POST /api/tests (protected - admin)`);
    console.log(`   GET  /api/labs/available (public)`);
    console.log(`   GET  /api/labs/:id/tests (public)`);
    console.log(`   PUT  /api/labs/:id/tests (protected - lab)`);
    console.log(`   POST /api/bookings (protected - patient)`);
    console.log(`   GET  /api/bookings/patient/:id (protected)`);
    console.log(`   GET  /api/bookings/lab/:id (protected)`);
    console.log(`\n👀 Watching for requests...\n`);
});

export default app;