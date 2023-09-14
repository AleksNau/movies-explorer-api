const router = require('express').Router();
const {
  login, createProfile,
} = require('../controllers/users');

const {
  validationLogin, validationCreateUser,
} = require('../middlewares/validation');
// создание пользователя
router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createProfile);

module.exports = router;
