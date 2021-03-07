import {promises as fsp} from 'fs';

const COUNTRY_PER_PAGE = 8;

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

export type StateUserInfo = {
  id: string;
  name: string;
  avatar: string;
  lang: string;
};

export type StateSettings = {
  theme: string;
  currencyList: CurrencyType;
};
export type LanguagesType = {
  en?: string;
  ru?: string;
  be?: string;
};
export type StateCountry = {
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
  countriesList: StateCountry[];
  currenciesList: CurrencyType;
};

function isDatabaseType(instance: DatabaseType): boolean {
  let isType: boolean = true;

  isType = (instance.users !== undefined) && isType;
  isType = (instance.countriesList !== undefined) && isType;
  isType = (instance.currenciesList !== undefined) && isType;

  return isType;
}

const fileName = 'travel-bd.json';
const filePath = `${__dirname}/${fileName}`;

export const readFile = async (): Promise<DatabaseType> => {
  let data: DatabaseType;

  try {
    const content = await fsp.readFile(filePath, 'utf-8');
    const parsedList: DatabaseType = JSON.parse(content);

    if (!isDatabaseType(parsedList)) {
      throw new Error('The data does not match the type "DatabaseType"');
    }

    data = parsedList;
  } catch (e: unknown) {
    if (!(e instanceof Error)) {
      throw e;
    }

    console.warn(`There was Error: ${e.message}`)
  }
  return data;
};

export const writeFile = async (data: DatabaseType): Promise<DatabaseType> => {
  const stringifierList = JSON.stringify(data);

  await fsp.writeFile(filePath, stringifierList, 'utf-8');
  return data;
};

// GET CountriesList
export const getCountriesList = async (
  count: number = COUNTRY_PER_PAGE,
  offset: number = 0
): Promise<StateCountry[]> => {
  const data: DatabaseType = await readFile();

  const countryList = data.countriesList;

  if (count === 0) {
    return countryList.slice(offset)
  }
  return countryList.slice(offset, offset + count);
};

// GET CountryById
export const getCountryById = async (id: string): Promise<StateCountry> => {

  const data: DatabaseType = await readFile();
  const countryList = data.countriesList;

  return countryList.find((item: StateCountry) => {
    return item.id === id;
  })
};

// GET All Users
export const getUsers = async (): Promise<DBUser[]> => {
  const data: DatabaseType = await readFile();
  return data.users;
};

// GET UserById
export const getUserInfo = async (id: string): Promise<DBUser> => {
  const data: DatabaseType = await readFile();
  const userData: DBUser[] = data.users;

  return userData.find((user: DBUser) => user.id === id);
};

// GET CurrenciesList
export const getCurrenciesList = async (): Promise<CurrencyType> => {
  const data: DatabaseType = await readFile();
  return data.currenciesList;
};

// GET CurrencyByCode
export const getCurrencyByCode = async (code: string): Promise<CurrencyType> => {
  const data: DatabaseType = await readFile();
  const currency: CurrencyType = data.currenciesList;

  return {[code]: currency[code]};
};

// POST CreateUser
export const createUser = async (user: DBUser): Promise<DBUser> => {
  const data: DatabaseType = await readFile();
  const users = data.users;
  users.push(user);
  data.users = users;

  await writeFile(data);

  return user;
};

// POST CreateCountry
export const createCountry = async (country: StateCountry): Promise<StateCountry> => {
  const data: DatabaseType = await readFile();
  const countries: StateCountry[] = data.countriesList;

  countries.push(country);
  data.countriesList = countries;

  await writeFile(data);
  return country;
};

// POST CreateCurrency
export const createCurrency = async (currency: CurrencyType): Promise<CurrencyType> => {
  const data: DatabaseType = await readFile();
  let currencies: CurrencyType = data.currenciesList;
  currencies = {...currencies, ...currency};
  data.currenciesList = currencies;

  await writeFile(data);
  return currency;
};



// export const create = async (item: ItemType): Promise<ItemType | undefined> => {
//   const list: ItemType[] = await readFile();
//   list.push(item);
//
//   await writeFile(list);
//
//   return item;
// };
//
// export const update = async (item: ItemType): Promise<ItemType> => {
//   const list: ItemType[] = await readFile();
//
//   const index = list.findIndex(v => v.id === item.id);
//
//   if (index === -1) {
//     throw new Error();
//   }
//   list[index] = item;
//   await writeFile(list);
//
//   return item;
// };
//
// export const remove = async (id: string): Promise<void> => {
//   const list: ItemType[] = await readFile();
//
//   const index = list.findIndex(v => v.id === id);
//
//   list.splice(index, 1);
//
//   if (index === -1) {
//     throw new Error();
//   }
//
//   await writeFile(list);
// };
