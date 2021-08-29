export default {
  translation: {
    brand: 'Hexlet Chat',
    logout: 'Выйти',
    loading: 'Загрузка...',
    loginForm: {
      title: 'Войти',
      no_account_link: 'Нет аккаунта?',
      button: 'Войти',
      registration_link: 'Регистрация',
      fields: {
        username: 'Ваш ник',
        password: 'Пароль',
      },
    },
    signupForm: {
      title: 'Регистрация',
      button: 'Зарегистрироваться',
      fields: {
        username: 'Имя пользователя',
        password: 'Пароль',
        confirm_password: 'Подтвердите пароль',
      },
    },
    validation: {
      required_field: 'Обязательное поле',
      password_incorrect: 'Неверные имя пользователя или пароль',
      username_exists: 'Такой пользователь уже существует',
      passwords_must_match: 'Пароли должны совпадать',
      username_length: 'От 3 до 20 символов',
      password_length: 'Не менее 6 символов',
      should_be_unique: 'Должно быть уникальным',
    },
    chat: {
      placeholder: 'Введите сообщение...',
      message_count: {
        messages_0: '{{count}} сообщение',
        messages_1: '{{count}} сообщения',
        messages_2: '{{count}} сообщений',
      },
      channel_name: '# {{name}}',
      send: 'Отправить',
    },
    popup: {
      link: {
        remove: 'Удалить',
        rename: 'Переименовать',
      },
      button: {
        remove: 'Удалить',
        rename: 'Переименовать',
        send: 'Отправить',
        cancel: 'Отменить',
      },
      title: {
        add: 'Добавить канал',
        remove: 'Удалить канал?',
        rename: 'Переименовать канал',
      },
      message: {
        confirm: 'Уверены?',
      },
    },
  },
};
