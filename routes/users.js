const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getProfileById, getUsersList, updateProfile, getCurrentUser,
} = require('../controllers/users');

const {
  validationUpdateUser,
} = require('../middlewares/validation');
// создание пользователя
router.get('/me', getCurrentUser);
// получить пользователя по id
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), getProfileById);

// получить всех пользователей
router.get('/', getUsersList);

router.patch('/me', validationUpdateUser, updateProfile);

module.exports = router;
