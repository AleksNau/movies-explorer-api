const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const { ValidationError } = require('mongoose').Error;
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const { getJwtToken } = require('../utils/jwt');

const {
  validationErrorText,
  userNotFoundErrorText,
  sameEmailErrorText,
} = require('../utils/constants');

const {
  BadRequestError,
  NotFoundError,
  ConflictError,
} = require('../errors/errors');

const createProfile = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      userModel.create({
        name, email, password: hash,
      })
        .then((user) => res.status(HTTP_STATUS_CREATED).send({
          _id: user._id,
          email: user.email,
          name: user.name,

        }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError(sameEmailErrorText));
          }
          if (err instanceof ValidationError) {
            return next(new BadRequestError(`${validationErrorText} ${err.message}`));
          }
          return next(err);
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = getJwtToken({ _id: user._id, email: user.email });
      return res.status(HTTP_STATUS_OK).send({ token });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about, email } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about, email },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new NotFoundError(userNotFoundErrorText);
    })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError(`${validationErrorText} ${err.message}`));
      }

      return next(err);
    });
  // 400,404,500
};

// текущий пользователь
const getCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFoundErrorText);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError(userNotFoundErrorText));
      } return next(err);
    });
};

module.exports = {
  createProfile,
  updateProfile,
  getCurrentUser,
  login,
};
