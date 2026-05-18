require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const { globalLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/session');
const attendanceRoutes = require('./routes/attendance');
const userRoutes = require('./routes/user');

const app = express();

connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(globalLimiter);

app.use('/auth', authRoutes);
app.use('/session', sessionRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/user', userRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
