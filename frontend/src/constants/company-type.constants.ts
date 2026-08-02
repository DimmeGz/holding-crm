export const CompanyType = {
  MANUFACTURER: 'man',
  INNER_COMPANY: 'com',
  BUYER: 'buy',
  COMMISSIONER: 'cor',
} as const;

export type CompanyTypeValue =
  (typeof CompanyType)[keyof typeof CompanyType];
