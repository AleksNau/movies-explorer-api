const router = require('express').Router();
const {
  updateProfile, getCurrentUser,
} = require('../controllers/users');

const {
  validationUpdateUser,
} = require('../middlewares/validation');
// создание пользователя
router.get('/me', getCurrentUser);

router.patch('/me', validationUpdateUser, updateProfile);

module.exports = router;
