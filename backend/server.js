import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

//Inventory - Deshitha
import itemsRouter from './routes/Inventory/items.route.js';

// Import Employee models
import Counter from './models/Employee/Counter.js';

// Employee Routes
import employeeRoutes from './routes/Employee/employeeRoutes.js';
import attendanceRoutes from './routes/Employee/attendanceRoutes.js';
import payrollRoutes from './routes/Employee/payrollRoutes.js';

const port = process.env.PORT || 5001;

// Connect to the database
connectDB();

const app = express();

// Set up CORS with specific options
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Set the view engine to EJS
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'ejs');

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// User routes
app.use('/api/users', userRoutes);

//Inventory - Deshitha
app.use('/api/items', itemsRouter);

// Employee - Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payroll', payrollRoutes);

// Test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Serve static files and handle routing for production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/medicart-frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'medicart-frontend', 'dist', 'index.html'))
  );
} else {
  // For development, render EJS on the root route
  app.get('/', (req, res) => {
    res.render('index');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () => console.log(`MediCart server started on port ${port}`));