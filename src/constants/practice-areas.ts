export enum PracticeAreaEnum {
  FAMILY_LAW = "FAMILY_LAW",
  CRIMINAL_LAW = "CRIMINAL_LAW",
  COMMERCIAL_LAW = "COMMERCIAL_LAW",
  IMMIGRATION_LAW = "IMMIGRATION_LAW",
  PERSONAL_INJURY = "PERSONAL_INJURY",
  REAL_ESTATE = "REAL_ESTATE",
  LABOR_LAW = "LABOR_LAW",
  BANKRUPTCY = "BANKRUPTCY",
  TAX_LAW = "TAX_LAW",
  INTELLECTUAL_PROPERTY = "INTELLECTUAL_PROPERTY",
  INHERITANCE_LAW = "INHERITANCE_LAW",
  ENVIRONMENTAL_LAW = "ENVIRONMENTAL_LAW",
  MEDICAL_LIABILITY = "MEDICAL_LIABILITY",
  CONTRACT_LAW = "CONTRACT_LAW",
  CIVIL_RIGHTS = "CIVIL_RIGHTS",
}

export const PRACTICE_AREAS = Object.values(PracticeAreaEnum);

export type PracticeArea = PracticeAreaEnum;

export const PRACTICE_AREA_LABELS = {
  [PracticeAreaEnum.FAMILY_LAW]: "Семейно право",
  [PracticeAreaEnum.CRIMINAL_LAW]: "Наказателно право",
  [PracticeAreaEnum.COMMERCIAL_LAW]: "Търговско право",
  [PracticeAreaEnum.IMMIGRATION_LAW]: "Имиграционно право",
  [PracticeAreaEnum.PERSONAL_INJURY]: "Обезщетения за вреди",
  [PracticeAreaEnum.REAL_ESTATE]: "Недвижими имоти",
  [PracticeAreaEnum.LABOR_LAW]: "Трудово право",
  [PracticeAreaEnum.BANKRUPTCY]: "Несъстоятелност",
  [PracticeAreaEnum.TAX_LAW]: "Данъчно право",
  [PracticeAreaEnum.INTELLECTUAL_PROPERTY]: "Интелектуална собственост",
  [PracticeAreaEnum.INHERITANCE_LAW]: "Наследствено право",
  [PracticeAreaEnum.ENVIRONMENTAL_LAW]: "Екологично право",
  [PracticeAreaEnum.MEDICAL_LIABILITY]: "Медицинска отговорност",
  [PracticeAreaEnum.CONTRACT_LAW]: "Облигационно право",
  [PracticeAreaEnum.CIVIL_RIGHTS]: "Граждански права",
} as const;

export const PRACTICE_AREA_DESCRIPTIONS = {
  [PracticeAreaEnum.FAMILY_LAW]:
    "Развод, попечителство, осиновяване и семейни отношения",
  [PracticeAreaEnum.CRIMINAL_LAW]:
    "Защита срещу наказателни обвинения и правни нарушения",
  [PracticeAreaEnum.COMMERCIAL_LAW]:
    "Създаване на фирми, договори и търговски сделки",
  [PracticeAreaEnum.IMMIGRATION_LAW]:
    "Заявления за виза, гражданство и имиграционни въпроси",
  [PracticeAreaEnum.PERSONAL_INJURY]:
    "Злополуки, медицинска отговорност и обезщетения за вреди",
  [PracticeAreaEnum.REAL_ESTATE]:
    "Сделки с имоти, наемни отношения и спорове за недвижимост",
  [PracticeAreaEnum.LABOR_LAW]:
    "Трудови права, дискриминация и трудови спорове",
  [PracticeAreaEnum.BANKRUPTCY]:
    "Облекчаване на дългове и производства по несъстоятелност",
  [PracticeAreaEnum.TAX_LAW]: "Данъчно планиране, спорове и данъчни въпроси",
  [PracticeAreaEnum.INTELLECTUAL_PROPERTY]:
    "Патенти, търговски марки, авторски права и търговски тайни",
  [PracticeAreaEnum.INHERITANCE_LAW]:
    "Завещания, тръстове и наследствено планиране",
  [PracticeAreaEnum.ENVIRONMENTAL_LAW]:
    "Екологично съответствие и регулаторни въпроси",
  [PracticeAreaEnum.MEDICAL_LIABILITY]:
    "Небрежност на медицински персонал и медицински грешки",
  [PracticeAreaEnum.CONTRACT_LAW]:
    "Изготвяне на договори, спорове и изпълнение на договори",
  [PracticeAreaEnum.CIVIL_RIGHTS]:
    "Конституционни права и случаи на дискриминация",
} as const;
