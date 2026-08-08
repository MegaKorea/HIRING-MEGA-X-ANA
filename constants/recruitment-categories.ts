export const RECRUITMENT_CATEGORIES = [
  'HR',
  'SALES',
  'ADS',
  'CONTENT',
  'EDITOR',
  'DESIGNER',
  'SEO',
  'IT',
  'ACCOUNTANT',
  'PANCAKE',
  'OTHER',
] as const;

export type RecruitmentCategory = (typeof RECRUITMENT_CATEGORIES)[number];

export const RECRUITMENT_CATEGORY_SET = new Set<string>(RECRUITMENT_CATEGORIES);
