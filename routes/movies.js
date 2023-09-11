const router = require('express').Router();
const {
  validationCreateCard,
  validationCardById,
} = require('../middlewares/validation');
const {
  getMovies, createMovie, deleteMovie, getLikes, deleteLikes,
} = require('../controllers/cards');
// отправка карточек
router.get('/', getMovies);
//validationCreateCard
router.post('/', createMovie);

router.delete('/:cardId', validationCardById, deleteMovie);

router.put('/:cardId/likes', validationCardById, getLikes);
router.delete('/:cardId/likes', validationCardById, deleteLikes);

module.exports = router;
