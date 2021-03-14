export type DBUser = {
  id: string;
  name: string;
  avatar: string;
  lang: string;
  theme: string;
  currencies: string[];
  attractionRates: {
    attrId: string;
    rating: number;
  }[]
};
export type CurrencyType = {
  code: string;
  nameRu: string;
  nameEn: string;
  nameBe: string;
};

export type LanguagesType = {
  en?: string;
  ru?: string;
  be?: string;
};

export type AttractionType = {
  id: string;
  photo: string;
  name: LanguagesType;
  description: LanguagesType;
  rating: {
    sum: number;
    count: number;
  }
}

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
  attractions: AttractionType[];
};

export type DatabaseType = {
  users: DBUser[];
  countriesList: CountryType[];
  currenciesList: CurrencyType[];
};

export type UpdateRatingType = {
  attractionId: string,
  userId: string,
  countryId: string,
  rating: number,
}
