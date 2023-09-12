const router = require('express').Router();
const {
  validationCreateCard,
  validationCardById,
} = require('../middlewares/validation');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
// отправка карточек
router.get('/', getMovies);
//validationCreateCard
router.post('/', createMovie);

router.delete('/:cardId', validationCardById, deleteMovie);

module.exports = router;
