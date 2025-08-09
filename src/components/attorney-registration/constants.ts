export const REGISTRATION_CONSTANTS = {
  STEPS: {
    PERSONAL: "personal",
    PROFESSIONAL: "professional",
    PRACTICE_AND_LOCATION: "practiceAndLocation",
    PRICING: "pricing",
  },

  STEP_TITLES: {
    personal: "Лична информация",
    professional: "Професионален опит",
    practiceAndLocation: "Области на практика и местоположение",
    pricing: "Ценообразуване и пакети",
  },

  STEP_DESCRIPTIONS: {
    personal: "Кажете ни кои сте",
    professional: "Разкажете ни за вашето правно образование",
    practiceAndLocation: "В кои области практикувате и къде?",
    pricing: "Определете цените за консултации",
  },

  BUTTONS: {
    NEXT: "Следваща стъпка",
    PREVIOUS: "Предишна стъпка",
    SUBMIT: "Завърши регистрацията",
    ADD_PACKAGE: "Добави пакет",
    REMOVE_PACKAGE: "Премахни",
  },

  PLACEHOLDERS: {
    FULL_NAME: "Въведете вашето пълно име",
    EMAIL: "Въведете вашия имейл адрес",
    BAR_ID: "Въведете номера си в адвокатската колегия",
    YEARS_EXPERIENCE: "Години опит",
    EDUCATION: "напр., Софийски университет, право 2015",
    BIO: "Разкажете на потенциалните клиенти за вашия опит, специализации и подход към правната практика...",
    CITY: "Град",
    STATE: "Област/Регион",
    COUNTRY: "Страна",
    ADDRESS: "Въведете адрес (улица, номер)",
    ZIP_CODE: "Пощенски код",
    HOURLY_RATE: "Въведете часова ставка в лева",
    PACKAGE_NAME: "напр., Преглед на договор",
    PACKAGE_DESCRIPTION: "Опишете какво включва този пакет...",
    PACKAGE_PRICE: "Цена на пакета в лева",
  },

  LABELS: {
    FULL_NAME: "Пълно име",
    EMAIL: "Имейл адрес",
    BAR_ID: "Номер в адвокатската колегия",
    YEARS_EXPERIENCE: "Години опит",
    EDUCATION: "Образование",
    BIO: "Професионална биография",
    PRACTICE_AREAS: "Области на практика",
    LOCATION: "Местоположение",
    ADDRESS: "Адрес",
    ZIP_CODE: "Пощенски код",
    LANGUAGES: "Говорими езици",
    HOURLY_RATE: "Часова ставка (лв.)",
    FIXED_PACKAGES: "Пакети с фиксирана цена (по избор)",
  },

  COMMON_LANGUAGES: [
    "Български",
    "Английски",
    "Немски",
    "Френски",
    "Руски",
    "Испански",
    "Италиански",
    "Турски",
    "Гръцки",
    "Румънски",
    "Сръбски",
    "Македонски",
    "Албански",
    "Арабски",
    "Китайски",
  ],
} as const;

export type RegistrationStep = keyof typeof REGISTRATION_CONSTANTS.STEP_TITLES;

