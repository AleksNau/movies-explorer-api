const validationURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
// константы ошибок
const validationErrorText = 'Ошибка валидации:';
const notFoundErrorText = 'Запрашиваемый фильм не найден';
const forbiddenErrorText = 'Вы не можете удалить чужую карточку';
const userNotFoundErrorText = 'Пользователь не найден';
const sameEmailErrorText = 'Пользователь с таким email уже существует';
const authErrorText = 'Необходима авторизация!';
module.exports = {
  validationURL,
  validationErrorText,
  notFoundErrorText,
  forbiddenErrorText,
  userNotFoundErrorText,
  sameEmailErrorText,
  authErrorText,
};
