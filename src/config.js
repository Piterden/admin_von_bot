const messageTypeConfig = (type) => ({
  [type]: {
    enabled: {
      name: 'Включено',
      type: Boolean,
      default: true,
      yes: '✅',
      no: '⛔️',
      description: 'Определяет включен ли фильтр для голосовых сообщений.',
    },
    buttons: {
      name: 'Кнопки',
      type: Boolean,
      default: true,
      yes: '✅',
      no: '⛔️',
      description: 'Определяет подменять ли сообщение своим с инлайн кнопками.',
    },
    removeTimeout: {
      name: 'Таймаут удаления',
      type: Number,
      default: 0,
      description: 'Определяет через какое время сообщение удалится.',
      unit: 'сек',
      min: 0,
      max: 3600,
    },
    showAuthor: {
      name: 'Показ. автора',
      type: Boolean,
      default: true,
      yes: '✅',
      no: '⛔️',
      description: 'Определяет показывать или нет имя автора сообщения',
    },
  },
})

module.exports = {
  captcha: {
    waitingTimeout: {
      name: 'Таймаут капчи',
      type: Number,
      description: 'Время ожидания нажатия на кнопу. По истечении произойдет кик юзера.',
      default: 300,
      unit: 'сек',
      min: 60,
      max: 1200,
    },
    unbanTimeout: {
      name: 'Таймаут до разбана',
      type: Number,
      description: 'Время ожидания перед разбаном при неправильном выборе.',
      default: 40,
      unit: 'сек',
      min: 30,
      max: 300,
    },
    messageGreetings: {
      name: 'Сообщ. приветствие',
      type: String,
      description: 'Текст приветствия, который пользователь видит зайдя в чат.',
      default: 'Привет, {name}, нажми на правильную кнопу, чтобы начать общение.',
      placeholders: ['name'],
      max: 255,
    },
    messageCaptcha: {
      name: 'Сообщ. вопрос',
      type: String,
      description: 'Вопрос, на который пользователь должен ответить нажатием на кнопу.',
      default: '*Что обсуждается в этом чате?*',
      max: 255,
    },
    messageWelcome: {
      name: 'Сообщ. успешно',
      type: String,
      description: 'Текст приветствия, который пользователь видит выбрав верный вариант.',
      default: 'Добро пожаловать, {name}!',
      placeholders: ['name'],
      max: 255,
    },
    notYouToast: {
      name: 'Увед. не юзер',
      type: String,
      description: 'Текст уведомления, который видит любой человек, не проходящий сейчас капчу, нажав на любую кнопу.',
      default: 'Не ты, балда!!!',
      max: 50,
    },
    successToast: {
      name: 'Увед. успешно',
      type: String,
      description: 'Текст уведомления, который видит проходящий капчу, выбрав верный вариант.',
      default: 'Правильно! Добро пожаловать!',
      max: 50,
    },
    failuteToast: {
      name: 'Увед. ошибка',
      type: String,
      description: 'Текст уведомления, который видит проходящий капчу, выбрав неверный вариант.',
      default: 'Неправильно! Попробуйте ещё раз через минуту!',
      max: 50,
    },
    buttons: {
      name: 'Кнопки',
      type: Array,
      max: 9,
      default: `JavaScript
Котики
Анимэ`,
      description: 'Список кноп, показываемых пользователю. Каждая кнопа с новой строки. Длина текста одной кнопы не должна превышать 25 символов. Первая кнопа является правильным вариантом.',
    },
  },
  spam: {
    ...messageTypeConfig()
  },
}
