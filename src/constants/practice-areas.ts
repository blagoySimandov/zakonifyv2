export const PRACTICE_AREAS = [
  'Family Law',
  'Criminal Law',
  'Corporate Law',
  'Immigration Law',
  'Personal Injury',
  'Real Estate Law',
  'Employment Law',
  'Bankruptcy Law',
  'Tax Law',
  'Intellectual Property',
  'Estate Planning',
  'Environmental Law',
  'Medical Malpractice',
  'Contract Law',
  'Civil Rights',
] as const

export type PracticeArea = typeof PRACTICE_AREAS[number]

export const PRACTICE_AREA_DESCRIPTIONS = {
  'Family Law': 'Divorce, custody, adoption, and domestic relations',
  'Criminal Law': 'Defense against criminal charges and legal violations',
  'Corporate Law': 'Business formation, contracts, and commercial transactions',
  'Immigration Law': 'Visa applications, citizenship, and immigration matters',
  'Personal Injury': 'Accidents, medical malpractice, and injury compensation',
  'Real Estate Law': 'Property transactions, landlord-tenant, and real estate disputes',
  'Employment Law': 'Workplace rights, discrimination, and labor disputes',
  'Bankruptcy Law': 'Debt relief, Chapter 7 and Chapter 13 proceedings',
  'Tax Law': 'Tax planning, disputes, and compliance issues',
  'Intellectual Property': 'Patents, trademarks, copyrights, and trade secrets',
  'Estate Planning': 'Wills, trusts, and succession planning',
  'Environmental Law': 'Environmental compliance and regulatory matters',
  'Medical Malpractice': 'Healthcare provider negligence and medical errors',
  'Contract Law': 'Agreement drafting, disputes, and contract enforcement',
  'Civil Rights': 'Constitutional rights and discrimination cases',
} as const