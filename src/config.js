module.exports = {
  captcha: {
    waitingTimeout: {
      type: Number,
      default: 300,
      description: 'Время ожидания нажатия на кнопу',
      unit: 'сек',
      min: 60,
      max: 1200,
    },
    unbanTimeout: {
      type: Number,
      default: 40,
      description: 'Время ожидания перед разбаном при неправильном выборе',
      unit: 'сек',
      min: 30,
      max: 300,
    },
    messageGreetings: {
      type: String,
      default: 'Привет, {name}, нажми на правильную кнопу, чтобы начать общение.',
      description: 'Текст приветствия, который пользователь видит зайдя в чат.',
      placeholders: ['name'],
      max: 255,
    },
    messageCaptcha: {
      type: String,
      default: '*Что обсуждается в этом чате?*',
      description: 'Вопрос, на который пользователь должен ответить нажатием на кнопу.',
      max: 255,
    },
    messageWelcome: {
      type: String,
      default: 'Добро пожаловать, {name}!',
      description: 'Текст приветствия, который пользователь видит выбрав верный вариант.',
      placeholders: ['name'],
      max: 255,
    },
    notYouToast: {
      type: String,
      default: 'Не ты, балда!!!',
      description: 'Текст уведомления, который видит любой человек, не проходящий сейчас капчу, нажав на любую кнопу.',
      max: 50,
    },
    successToast: {
      type: String,
      default: 'Правильно! Добро пожаловать!',
      description: 'Текст уведомления, который видит проходящий капчу, выбрав верный вариант.',
      max: 50,
    },
    failuteToast: {
      type: String,
      default: 'Неправильно! Попробуйте ещё раз через минуту!',
      description: 'Текст уведомления, который видит проходящий капчу, выбрав неверный вариант.',
      max: 50,
    },
    buttons: {
      type: Array,
      max: 9,
      default: `JavaScript
Котики
Анимэ`,
      description: 'Список кноп, показываемых пользователю. Каждая кнопа с новой строки. Длина текста одной кнопы не должна превышать 25 символов. Первая кнопа является правильным вариантом.',
    },
  },
}
