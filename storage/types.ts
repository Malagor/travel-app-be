export type DBUser = {
  id: string;
  name: string;
  avatar: string;
  lang: string;
  theme: string;
  currencies: string[];
};
export type CurrencyType = {
  [key: string]: { nameRu: string; nameEn: string; nameBe: string };
};

export type LanguagesType = {
  en?: string;
  ru?: string;
  be?: string;
};
export type CountryType = {
  id: string | number;
  name: LanguagesType;
  capital: LanguagesType;
  currency?: CurrencyType;
  description?: LanguagesType;
  population?: number;
  area?: number;
  languages?: string[];
  videos?: string[];
  photos?: string[];
  locale?: string;
  timeZone?: string;
};

export type DatabaseType = {
  users: DBUser[];
  countriesList: CountryType[];
  currenciesList: CurrencyType;
};
