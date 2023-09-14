const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
require('dotenv').config();

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./utils/limiter')
const handleError = require('./middlewares/handleError');
const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('mangoo включено');
});

const app = express();
app.use(cors());

app.use(helmet());

module.exports.createCard = () => {
};

app.use(requestLogger);
app.use(limiter);
// импортированили роуты
const router = require('./routes/index');

app.use(express.json());

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(handleError);
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
