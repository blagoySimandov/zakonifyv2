export const ATTORNEY_DASHBOARD_MESSAGES = {
  NAVIGATION: {
    DASHBOARD: "Табло",
    AVAILABILITY: "Достъпност",
    CONSULTATIONS: "Консултации",
    CLIENTS: "Клиенти",
    SETTINGS: "Настройки",
    PROFILE: "Профил",
  },
  
  DASHBOARD: {
    TITLE: "Табло за управление",
    SUBTITLE: "Управлявайте вашата практика и достъпност",
    WELCOME_BACK: "Добре дошли обратно",
  },
  
  AVAILABILITY_PROFILE: {
    TITLE: "Профил на достъпност",
    SUBTITLE: "Конфигурирайте работните си часове и настройки за консултации",
    NO_PROFILE_TITLE: "Няма конфигуриран профил",
    NO_PROFILE_DESCRIPTION: "Създайте профил на достъпност, за да започнете да приемате резервации от клиенти.",
    CREATE_PROFILE: "Създай профил",
    EDIT_PROFILE: "Редактирай профил",
    SAVE_PROFILE: "Запази профил",
    CANCEL: "Отказ",
    
    STATUS: {
      ACTIVE: "Активен",
      INACTIVE: "Неактивен",
      TOGGLE_AVAILABILITY: "Превключи достъпност",
    },
    
    WORKING_HOURS: {
      TITLE: "Работни часове",
      SUBTITLE: "Задайте работното си време за всеки ден от седмицата",
      MONDAY: "Понеделник",
      TUESDAY: "Вторник", 
      WEDNESDAY: "Сряда",
      THURSDAY: "Четвъртък",
      FRIDAY: "Петък",
      SATURDAY: "Събота",
      SUNDAY: "Неделя",
      START_TIME: "Начало",
      END_TIME: "Край",
      CLOSED: "Затворено",
      ADD_BREAK: "Добави почивка",
      BREAK_TIME: "Почивка",
      REMOVE_BREAK: "Премахни",
    },
    
    CONSULTATION_SETTINGS: {
      TITLE: "Настройки за консултации",
      SUBTITLE: "Конфигурирайте продължителността, цените и политиките за резервации",
      DEFAULT_DURATION: "Стандартна продължителност",
      BUFFER_TIME: "Време за подготовка",
      MAX_CONSULTATIONS_PER_DAY: "Максимум консултации на ден",
      ALLOW_BACK_TO_BACK: "Позволи последователни консултации",
      MIN_ADVANCE_BOOKING: "Минимално време за резервация",
      MAX_ADVANCE_BOOKING: "Максимално време за резервация",
      MINUTES: "минути",
      HOURS: "часа",
      DAYS: "дни",
    },
    
    CONSULTATION_TYPES: {
      TITLE: "Видове консултации",
      SUBTITLE: "Конфигурирайте достъпните видове консултации и техните цени",
      VIDEO: "Видео консултация",
      IN_PERSON: "Лична консултация", 
      DURATION: "Продължителност",
      PRICE: "Цена",
      ENABLED: "Активен",
      PRICE_PER_HOUR: "цена на час",
    },
    
    BLOCKED_PERIODS: {
      TITLE: "Блокирани периоди",
      SUBTITLE: "Управлявайте времето си - отпуски, съдебни заседания и други ангажименти",
      ADD_BLOCKED_PERIOD: "Добави блокиран период",
      NO_BLOCKED_PERIODS: "Няма блокирани периоди",
      START_DATE: "Начална дата",
      END_DATE: "Крайна дата",
      TYPE: "Тип",
      TITLE_FIELD: "Заглавие",
      REASON: "Причина",
      RECURRING: "Повтарящ се",
      SAVE_PERIOD: "Запази период",
      DELETE_PERIOD: "Изтрий период",
      
      TYPES: {
        VACATION: "Отпуска",
        HOLIDAY: "Празник", 
        COURT_APPEARANCE: "Съдебно заседание",
        PERSONAL: "Лично време",
        CONFERENCE: "Конференция",
        UNAVAILABLE: "Недостъпен",
      },
    },
    
    TIMEZONE: {
      TITLE: "Часова зона",
      SUBTITLE: "Изберете часовата зона за вашите работни часове",
      CURRENT_TIMEZONE: "Текуща часова зона",
    },
  },
  
  STATS: {
    TOTAL_CONSULTATIONS: "Общо консултации",
    UPCOMING_CONSULTATIONS: "Предстоящи консултации", 
    THIS_WEEK: "Тази седмица",
    THIS_MONTH: "Този месец",
    AVAILABILITY_STATUS: "Статус на достъпност",
    NEXT_AVAILABLE_SLOT: "Следващ свободен час",
    REVENUE: "Приходи",
    RATING: "Рейтинг",
  },
  
  QUICK_ACTIONS: {
    TITLE: "Бързи действия",
    VIEW_CALENDAR: "Виж календар",
    MANAGE_CLIENTS: "Управление на клиенти",
    UPDATE_PROFILE: "Обнови профил",
    VIEW_REPORTS: "Виж отчети",
  },
  
  ERRORS: {
    PROFILE_LOAD_ERROR: "Възникна грешка при зареждане на профила",
    PROFILE_SAVE_ERROR: "Възникна грешка при запазване на профила",
    AUTHENTICATION_ERROR: "Трябва да влезете в профила си като адвокат",
    ACCESS_DENIED: "Нямате достъп до тази страница",
    INVALID_TIME_FORMAT: "Невалиден формат на времето",
    INVALID_DATE_RANGE: "Невалиден период от дати",
  },
  
  SUCCESS: {
    PROFILE_SAVED: "Профилът е запазен успешно",
    AVAILABILITY_UPDATED: "Достъпността е обновена",
    BLOCKED_PERIOD_ADDED: "Блокираният период е добавен",
    BLOCKED_PERIOD_REMOVED: "Блокираният период е премахнат",
  },
  
  CONFIRMATION: {
    DELETE_BLOCKED_PERIOD: "Сигурни ли сте, че искате да изтриете този блокиран период?",
    TOGGLE_AVAILABILITY: "Сигурни ли сте, че искате да промените статуса на достъпността си?",
  },
} as const;