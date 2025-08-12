import { PracticeAreaEnum } from "@/constants";

export const ATTORNEY_HEADER_MESSAGES = {} as const;

export const PRACTICE_AREA_LABELS: Record<PracticeAreaEnum, string> = {
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