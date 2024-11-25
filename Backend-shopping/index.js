import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { connectDB } from './db/connectDb.js'; // Include .js extension
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/product.route.js';
import path from 'path';
import { fileURLToPath } from 'url';
import orderRoutes from './routes/order.route.js'
import { stripeWebhook } from './controllers/order.controller.js';

dotenv.config();

const app = express();

// Derive __filename and __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CORS to allow multiple origins
const allowedOrigins = [
    "http://localhost:3000",  // Frontend app
    "http://localhost:3001"   // Admin app
];

app.use(cors({
    origin: allowedOrigins,  // Allow both frontend and admin apps
    credentials: true         // Allow cookies and authentication headers
}));

app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook );

app.use(express.json());
// Middleware for parsing URL-encoded form data (text fields)
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve the "uploads" folder as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use("/api", orderRoutes);

// Start server
app.listen(4000, () => {
    connectDB();
    console.log("Server is running on port 4000");
    console.log(process.env.JWT_SECRET);
    console.log(process.env.EMAIL_USER);
});

// api/products/update/id