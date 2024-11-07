const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const xssClean = require('xss-clean');
const rateLimit = require("express-rate-limit");

const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes')
const homeworkRoutes = require('./routes/homeworkRoutes');
const offerRoutes = require('./routes/offerRoutes')

const app = express();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 минут
  max: 10,
  headers: true,
  handler: (req, res) => {
    res.status(429).json({
      error:
        "Вы превысили лимит запросов. Пожалуйста, попробуйте снова через 5 минут.",
    });
  },
});

app.use(bodyParser.json());
app.use(cors());
app.use(xssClean());
app.use(express.static('public'));
app.use('/api', limiter);
app.use('/api', userRoutes);
app.use('/api', groupRoutes);
app.use('/api', homeworkRoutes);
app.use('/api', offerRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
  });
});