const router = require('express').Router();
const loggedInCheck = require('../middlewares/auth');
const {
  NotFoundError,
} = require('../errors/errors');

const userRouter = require('./users');
const moviesRouter = require('./movies');
const authoriazation = require('./sign');

router.use(authoriazation);
router.use(loggedInCheck);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.use((req, res, next) => next(new NotFoundError('Такая страница не существует')));

module.exports = router;
