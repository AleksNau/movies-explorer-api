const router = require('express').Router();
const {
  NotFoundError,
} = require('../errors/errors');

const userRouter = require('./users');
const moviesRouter = require('./movies');

router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.use((req, res, next) => next(new NotFoundError('Такая страница не существует')));

module.exports = router;
