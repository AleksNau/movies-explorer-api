const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const { CastError, ValidationError } = require('mongoose').Error;
const movieModel = require('../models/movie');

const {
  validationErrorText,
  notFoundErrorText,
  forbiddenErrorText,
} = require('../utils/constants');

const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors/errors');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  movieModel.find({ owner })
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch(next);// 400,500
};
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    trailerLink,
  } = req.body;
  const owner = req.user._id;
  return movieModel.create({
    owner,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    trailerLink,
  })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError(`${validationErrorText} ${err.message}`));
      }
      return next(err);
    });
};// 400,500

const deleteMovie = (req, res, next) => {
  const { cardId } = req.params;
  return movieModel.findById(cardId)
    .orFail(() => {
      throw new NotFoundError(notFoundErrorText);
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError(forbiddenErrorText);
      }
      return movieModel.deleteOne({ _id: cardId }).then(() => res.send({ message: 'Карточка с фильмом успешно удалена' }));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError(`Ошибка Id: ${err.message}`));
      }
      return next(err);
    });
};// 404

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
