const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { apiLimiter, securityHeaders } = require('./src/middlewares/security');
const simplifyRoutes = require('./src/routes/simplifyRoutes');

const app = express();

// 1. Security & Logging Middlewares
app.use(securityHeaders); 
app.use(morgan('dev')); 
app.use(cors({ origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*' })); 

app.use(express.json());

// 2. Database Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected to MVC backend daemon.'))
    .catch(err => console.error('MongoDB Connection Error:', err));
}

// 3. Mount Router endpoints
app.use('/api', apiLimiter, simplifyRoutes); 

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`ELI5 Standalone Backend listening on port ${PORT}`));
