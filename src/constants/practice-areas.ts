import { PRACTICE_AREA_MESSAGES } from "../messages/practice-areas";
import { PracticeAreaEnum } from "./practice-area-enum";

export const PRACTICE_AREAS = Object.values(PracticeAreaEnum);

export type PracticeArea = PracticeAreaEnum;

export const PRACTICE_AREA_LABELS = PRACTICE_AREA_MESSAGES;

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

export const POPULAR_PRACTICE_AREAS = [
  PracticeAreaEnum.FAMILY_LAW,
  PracticeAreaEnum.CRIMINAL_LAW,
  PracticeAreaEnum.COMMERCIAL_LAW,
  PracticeAreaEnum.PERSONAL_INJURY,
  PracticeAreaEnum.REAL_ESTATE,
] as const;

type PracticeAreaLabel = (typeof PRACTICE_AREA_LABELS)[keyof typeof PRACTICE_AREA_LABELS];

export const PRACTICE_AREA_LABEL_TO_ENUM: Record<PracticeAreaLabel, PracticeAreaEnum> = {
  "Семейно право": PracticeAreaEnum.FAMILY_LAW,
  "Наказателно право": PracticeAreaEnum.CRIMINAL_LAW,
  "Търговско право": PracticeAreaEnum.COMMERCIAL_LAW,
  "Имиграционно право": PracticeAreaEnum.IMMIGRATION_LAW,
  "Обезщетения за вреди": PracticeAreaEnum.PERSONAL_INJURY,
  "Недвижими имоти": PracticeAreaEnum.REAL_ESTATE,
  "Трудово право": PracticeAreaEnum.LABOR_LAW,
  "Несъстоятелност": PracticeAreaEnum.BANKRUPTCY,
  "Данъчно право": PracticeAreaEnum.TAX_LAW,
  "Интелектуална собственост": PracticeAreaEnum.INTELLECTUAL_PROPERTY,
  "Наследствено право": PracticeAreaEnum.INHERITANCE_LAW,
  "Екологично право": PracticeAreaEnum.ENVIRONMENTAL_LAW,
  "Медицинска отговорност": PracticeAreaEnum.MEDICAL_LIABILITY,
  "Облигационно право": PracticeAreaEnum.CONTRACT_LAW,
  "Граждански права": PracticeAreaEnum.CIVIL_RIGHTS,
};
