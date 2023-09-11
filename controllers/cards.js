const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const { CastError, ValidationError } = require('mongoose').Error;
const movieModel = require('../models/movie');

const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors/errors');

const getMovies = (req, res, next) => movieModel.find()
  .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
  .catch(next);// 400,500

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
  })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError(`Ошибка валидации: ${err.message}`));
      }
      return next(err);
    });
};// 400,500

const deleteMovie = (req, res, next) => {
  const { cardId } = req.params;
  return movieModel.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }
      return movieModel.deleteOne({ _id: cardId }).then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError(`Ошибка Id: ${err.message}`));
      }
      return next(err);
    });
};// 404

const getLikes = (req, res, next) => {
  movieModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    })
    .then((card) => res.status(HTTP_STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError(`Ошибка Id: ${err.message}`));
      }
      return next(err);
    });
// 400,404,500
};
// убрать лайк
const deleteLikes = (req, res, next) => {
  movieModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    })
    .then((card) => res.status(HTTP_STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError(`Ошибка Id: ${err.message}`));
      }
      return next(err);
    });
// 400,404,500
};
module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
  getLikes,
  deleteLikes,
};
