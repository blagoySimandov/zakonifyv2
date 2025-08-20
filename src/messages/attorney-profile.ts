export const ATTORNEY_PROFILE_MESSAGES = {
  LOADING: {
    PROFILE: "Зареждане на профил...",
    REVIEWS: "Зареждане на отзиви...",
  },

  ERROR: {
    NOT_FOUND: "Адвокатът не е намерен",
    NOT_FOUND_DESCRIPTION: "Профилът на адвоката, който търсите, не съществува или може да е премахнат.",
    LOAD_FAILED: "Неуспешно зареждане на профила на адвоката",
    INVALID_ID: "Невалиден идентификатор на адвоката",
    NETWORK_ERROR: "Мрежова грешка. Моля, опитайте отново.",
  },

  SUCCESS: {
    PROFILE_LOADED: "Профилът на адвоката е зареден успешно",
    MESSAGE_SENT: "Съобщението е изпратено успешно",
    CONSULTATION_BOOKED: "Консултацията е запазена успешно",
  },

  INFO: {
    NO_BIOGRAPHY: "Няма предоставена биография.",
    NO_EDUCATION: "Информацията за образованието не е налична.",
    NO_REVIEWS: "Все още няма отзиви",
    NO_REVIEWS_DESCRIPTION: "Бъдете първият, който ще остави отзив за този адвокат",
    CONTACT_FOR_PRICING: "Свържете се за информация за цените.",
    CONSULTATION_DISCLAIMER: "Първоначалната консултация не представлява правен съвет.",
    YEARS_SUFFIX: "години",
    VERIFIED_ATTORNEY: "Верифициран адвокат",
    PER_HOUR: "на час",
    FIXED_FEE: "фиксирана цена",
    AVAILABLE_FOR_CONSULTATIONS: "Достъпен за консултации",
    REVIEW_COUNT_SINGULAR: "отзив",
    REVIEW_COUNT_PLURAL: "отзива",
    OUT_OF_FIVE: "от 5",
  },

  ACTIONS: {
    BOOK_CONSULTATION: "Запази консултация",
    SEND_MESSAGE: "Изпрати съобщение",
    VIEW_REVIEWS: "Вижте всички отзиви",
    CONTACT_ATTORNEY: "Свържи се с адвоката",
    GET_QUOTE: "Получи оферта",
    WRITE_REVIEW: "Напиши отзив",
    WRITE_FIRST_REVIEW: "Напишете първия отзив",
    SHOW_MORE: "Покажи повече",
    SHOW_LESS: "Покажи по-малко",
  },

  SECTIONS: {
    ABOUT: "За мен",
    PRACTICE_AREAS: "Области на практика", 
    PRICING: "Цени",
    CONTACT_INFORMATION: "Контактна информация",
    REVIEWS_RATINGS: "Отзиви и оценки",
    EDUCATION: "Образование",
    BAR_ASSOCIATION: "Адвокатска колегия",
    HOURLY_CONSULTATION: "Часова консултация",
    HOURLY_CONSULTATION_DESCRIPTION: "Стандартна правна консултация",
    FIXED_FEE_PACKAGES: "Пакети с фиксирана цена",
  },

  PLACEHOLDER: {
    NO_DESCRIPTION: "Няма налично описание",
    CONTACT_FOR_INFO: "Свържете се с адвоката за повече информация",
  },

  CONFIRMATION: {
    BOOK_CONSULTATION: "Сигурни ли сте, че искате да запазите консултация?",
    SEND_MESSAGE: "Вашето съобщение ще бъде изпратено до адвоката.",
  },
} as const;