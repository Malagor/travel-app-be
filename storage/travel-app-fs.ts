import {promises as fsp} from 'fs';
import {
  CurrencyType,
  DatabaseType,
  DBUser,
  CountryType
} from "./types";

const COUNTRY_PER_PAGE = 8;


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
): Promise<CountryType[]> => {
  const data: DatabaseType = await readFile();

  const countryList = data.countriesList;

  if (count === 0) {
    return countryList.slice(offset)
  }
  return countryList.slice(offset, offset + count);
};

// GET CountryById
export const getCountryById = async (id: string): Promise<CountryType> => {

  const data: DatabaseType = await readFile();
  const countryList = data.countriesList;

  return countryList.find((item: CountryType) => {
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
export const getCurrenciesList = async (): Promise<CurrencyType[]> => {
  const data: DatabaseType = await readFile();
  return data.currenciesList;
};

// GET CurrencyByCode
export const getCurrencyByCode = async (code: string): Promise<{[key: string]:CurrencyType}> => {
  const data: DatabaseType = await readFile();
  const currency: CurrencyType[] = data.currenciesList;

  const curCurrency = currency.find(((v: CurrencyType) => v.code === code));

  return {[code]: {...curCurrency}};
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
export const createCountry = async (country: CountryType): Promise<CountryType> => {
  const data: DatabaseType = await readFile();
  const countries: CountryType[] = data.countriesList;

  countries.push(country);
  data.countriesList = countries;

  await writeFile(data);
  return country;
};

// POST CreateCurrency
export const createCurrency = async (currency: CurrencyType): Promise<CurrencyType> => {
  const data: DatabaseType = await readFile();
  let currencies: CurrencyType[] = data.currenciesList;

  currencies.push(currency);
  data.currenciesList = currencies;

  await writeFile(data);
  return currency;
};
