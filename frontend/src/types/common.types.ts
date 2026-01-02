export type Theme = 'light' | 'dark';

export type UseThemeProps = {
  theme: Theme;
  toggleTheme: () => void;
};

export type GetCompanyDto = {
  name: string;
};
