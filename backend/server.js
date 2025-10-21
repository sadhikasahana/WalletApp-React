const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const expenseRoutes = require('./routes/expense');
app.use('/api/expenses', expenseRoutes);

const limitRoutes = require('./routes/limit');
app.use('/api/limits', limitRoutes);

const recurringRoutes = require('./routes/recurring');
app.use('/api/recurring', recurringRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// MongoDB connection

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log('MongoDB connected'))

  .catch(err => console.log(err));

// Test route

app.get('/', (req, res) => {
  res.send('API Running');
});

// Start server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
