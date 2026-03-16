require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const { APP_NAME, PORT, CLIENT_URL } = require('./config/app');

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: APP_NAME });
});

app.use('/api', routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`${APP_NAME} server running on port ${PORT}`);
});
