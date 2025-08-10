export const SETTINGS_MESSAGES = {
  PAGE_TITLE: "Настройки",

  TABS: {
    PROFILE: "Профил",
    AVAILABILITY: "Работно време & График",
    TIME_OFF: "Отсъствия",
  },

  PROFILE: {
    PERSONAL_INFO_TITLE: "Лична информация",
    PERSONAL_INFO_SUBTITLE: "Актуализирайте основната си информация",
    CONTACT_INFO_TITLE: "Контактна информация",
    CONTACT_INFO_SUBTITLE: "Управлявайте контактните си данни",
    LOCATION_INFO_TITLE: "Местоположение",
    LOCATION_INFO_SUBTITLE: "Информация за офиса и адреса",
    PROFESSIONAL_INFO_TITLE: "Професионална информация",
    PROFESSIONAL_INFO_SUBTITLE: "Правни специализации и опит",

    FIELDS: {
      FULL_NAME: "Пълно име",
      EMAIL: "Имейл адрес",
      PHONE: "Телефонен номер",
      CITY: "Град",
      ADDRESS: "Адрес",
      PRACTICE_AREAS: "Правни области",
      HOURLY_RATE: "Часова ставка",
      BIO: "Биография",
    },

    PLACEHOLDERS: {
      FULL_NAME: "Въведете пълното си име",
      EMAIL: "Въведете имейл адреса си",
      PHONE: "Въведете телефонния си номер",
      CITY: "Въведете града си",
      ADDRESS: "Въведете адреса си",
      HOURLY_RATE: "Въведете часовата си ставка",
      BIO: "Напишете кратка биография",
    },

    STATUS: {
      VERIFIED_ATTORNEY: "Верифициран адвокат",
    },
  },

  AVAILABILITY: {
    TITLE: "Наличност и График",
    SUBTITLE: "Преглед на наличността и предстоящи консултации",
    SCHEDULE_MANAGEMENT_TITLE: "Управление на графика",
    SCHEDULE_MANAGEMENT_SUBTITLE:
      "Конфигурирайте работното си време, почивки и настройки за консултации",
  },

  TIME_OFF: {
    TITLE: "Отсъствия",
    SUBTITLE: "Управлявайте отпуските и недостъпните периоди",
  },

  ACTIONS: {
    EDIT: "Редактиране",
    SAVE: "Запазване",
    CANCEL: "Отказ",
  },

  LOADING: {
    FETCHING_DATA: "Зареждане на данни...",
    SAVING: "Запазване...",
  },

  ERRORS: {
    LOADING_FAILED: "Неуспешно зареждане на данните",
    SAVE_FAILED: "Неуспешно запазване на промените",
    GENERIC_ERROR: "Възникна грешка. Моля, опитайте отново.",
  },

  SUCCESS: {
    PROFILE_UPDATED: "Профилът е актуализиран успешно",
    SETTINGS_SAVED: "Настройките са запазени успешно",
  },
} as const;
