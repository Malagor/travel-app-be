import {Collection, MongoClient} from 'mongodb';
import {CountryType, CurrencyType, DBUser} from "./types";

const COUNTRY_PER_PAGE = 8;
const USER_COLLECTION = 'users';
const COUNTRIES_COLLECTION = 'countries';
const CURRENCY_COLLECTION = 'currencies';

const dbName = 'travel-app';
const pass = 'YA4LhInD3NhKn0n2';

const url = `mongodb+srv://root:${pass}@travel-app-claster.y8dtm.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const localUrl = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`;

const getMongoInstance = async () => {
  let client;
  try {
    client = await MongoClient.connect(url, {useUnifiedTopology: true});
    return client.db(dbName);
  } catch (err) {
    console.error(err.stack);
  }
};

const getCollection = async (collectionName: string): Promise<Collection> => {
  const db = await getMongoInstance().catch(console.dir);
  return await db.collection(collectionName);
};

// GET CountriesList
export const getCountriesList = async (
  count: number = COUNTRY_PER_PAGE,
  offset: number,
  filter: string,
  lang: string
) => {

  const filterReg = new RegExp(`${filter}`, 'i');

  const collection = await getCollection(COUNTRIES_COLLECTION);
  const keyCountry = `name.${lang}`;
  const keyCapital = `capital.${lang}`;

  return await collection.find(
    {
      $or: [
        {[keyCountry]: {$regex: filterReg}},
        {[keyCapital]: {$regex: filterReg}}
      ]
    })
    .skip(offset)
    .limit(count)
    .toArray();

};

// GET CountryById
export const getCountryById = async (id: string) => {
  const collection = await getCollection(COUNTRIES_COLLECTION);
  return collection.findOne({id});
};

// GET All Users
export const getUsers = async () => {
  const collection = await getCollection(USER_COLLECTION);
  return await collection.find().toArray();
};

// GET UserById
export const getUserInfo = async (id: string) => {
  const collection = await getCollection(USER_COLLECTION);
  return collection.findOne({id});
};

// GET CurrenciesList
export const getCurrenciesList = async () => {
  const collection = await getCollection(CURRENCY_COLLECTION);
  return collection.find({}).toArray();
};

// GET CurrencyByCode
export const getCurrencyByCode = async (code: string) => {
  const collection = await getCollection(CURRENCY_COLLECTION);
  return collection.findOne({code});
};

// POST CreateUser
export const createUser = async (user: DBUser) => {
  const collection = await getCollection(USER_COLLECTION);

  user['_id'] = user.id;
  await collection.insertOne(user);
  return collection.findOne({id: user.id});
};

// POST CreateCountry
export const createCountry = async (country: CountryType) => {
  const collection = await getCollection(COUNTRIES_COLLECTION);
  country['_id'] = country.id;
  await collection.insertOne(country);
  return collection.findOne({_id: country.id});
};

// POST CreateCurrency
export const createCurrency = async (currency: CurrencyType) => {
  const collection = await getCollection(CURRENCY_COLLECTION);

  await collection.insertOne(currency);
  return collection.findOne({code: currency.code})
};

// UPDATE User
export const updateUser = async (user: DBUser) => {
  const collection = await getCollection(USER_COLLECTION);

  const id = user.id;
  const result = await collection.replaceOne({id}, user);
  return result.ops[0];
};

// UPDATE Country
export const updateCountry = async (country: CountryType) => {
  const collection = await getCollection(COUNTRIES_COLLECTION);

  const id = country.id;
  const result = await collection.replaceOne({id}, country);
  return result.ops[0];
};

// UPDATE Currency
export const updateCurrency = async (currency: CurrencyType) => {
  const collection = await getCollection(CURRENCY_COLLECTION);

  const code = currency.code;
  const result = await collection.replaceOne({code}, currency);
  return result.ops[0];
};


// DELETE User
export const deleteUser = async (id: string) => {
  const collection = await getCollection(USER_COLLECTION);
  const _id = id;
  return collection.deleteOne({_id});
};

// DELETE Currency
export const deleteCurrency = async (code: string) => {
  const collection = await getCollection(CURRENCY_COLLECTION);
  return collection.deleteOne({code});
};
