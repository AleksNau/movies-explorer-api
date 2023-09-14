const jwt = require('jsonwebtoken');

const { SECRET_CODE = 'SECRET' } = process.env;
const { UnauthorizedError } = require('../errors/errors');
const {
  authErrorText,
} = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorizedError(authErrorText);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_CODE);
  } catch (err) {
    next(new UnauthorizedError(authErrorText));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
