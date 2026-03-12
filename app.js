require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { startEmailOutboxWorker } = require('./src/services/email/emailOutboxProcessorService');

const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const port = Number(process.env.PORT || 3003);

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PETNOVA backend running correctly',
  });
});

app.use('/api', routes);

app.use(errorHandler);

startEmailOutboxWorker();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});