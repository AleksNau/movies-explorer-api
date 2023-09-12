const router = require('express').Router();
const {
  validationCreateMovie,
  validationCardById,
} = require('../middlewares/validation');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
// отправка карточек
router.get('/', getMovies);
// validationCreateMovie
router.post('/',validationCreateMovie, createMovie);

router.delete('/:cardId', validationCardById, deleteMovie);

module.exports = router;
