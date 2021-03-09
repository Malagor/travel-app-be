import {Collection, MongoClient} from 'mongodb';
import {CountryType, CurrencyType, DBUser} from "./types";

const COUNTRY_PER_PAGE = 8;
const USER_COLLECTION = 'users';
const COUNTRIES_COLLECTION = 'countries';
const CURRENCY_COLLECTION = 'currencies';

const dbName = 'travel-app';
const pass = 'Lm430#YBz%2ZVMMS';
const encodedPass = 'Lm430%23YBz%252ZVMMS';

const url = `mongodb+srv://travelAdmin:${encodedPass}@travel-app.xo4e2.mongodb.net?retryWrites=true&w=majority`;

const getMongoInstance = async () => {
  let client;
  try {
    client = await MongoClient.connect(url);
    return client.db(dbName);
  } catch (err) {
    console.error(err.stack);
  } finally {
    await client.close();
  }
};

const getCollection = async (collectionName: string): Promise<Collection> => {
  const db = await getMongoInstance().catch(console.dir);
  return db.collection(collectionName);
};
// function isDatabaseType(instance: DatabaseType): boolean {
//   let isType: boolean = true;
//
//   isType = (instance.users !== undefined) && isType;
//   isType = (instance.countriesList !== undefined) && isType;
//   isType = (instance.currenciesList !== undefined) && isType;
//
//   return isType;
// }


// GET CountriesList
export const getCountriesList = async (
  count: number = COUNTRY_PER_PAGE,
  offset: number = 0
) => {
  const collection = await getCollection(COUNTRIES_COLLECTION);

  const res = await collection.find({}).toArray();
  console.log('res', res);
  return res;
  // return await answer.toArray().then(data => data);

  // const countryList = data.countriesList;
  //
  // if (count === 0) {
  //   return countryList.slice(offset)
  // }
  // return countryList.slice(offset, offset + count);

};

// // GET CountryById
export const getCountryById = async (id: string) => {

  const collection = await getCollection(COUNTRIES_COLLECTION);

  return collection.findOne({id});
  // const data: DatabaseType = await readFile();
  // const countryList = data.countriesList;
  //
  // return countryList.find((item: CountryType) => {
  //   return item.id === id;
  // })
};
//
// // GET All Users
export const getUsers = async () => {
  const collection = await getCollection(USER_COLLECTION);
  return await collection.find().toArray();
};

// // GET UserById
export const getUserInfo = async (id: string) => {
  const collection = await getCollection(USER_COLLECTION);

  return collection.findOne({id});
  // const data: DatabaseType = await readFile();
  // const userData: DBUser[] = data.users;
  //
  // return userData.find((user: DBUser) => user.id === id);
};
//
// // GET CurrenciesList
export const getCurrenciesList = async () => {
  const collection = await getCollection(CURRENCY_COLLECTION);
  return collection.find({}).toArray();
  // const data: DatabaseType = await readFile();
  // return data.currenciesList;
};
//
// // GET CurrencyByCode
export const getCurrencyByCode = async (code: string) => {
  const collection = await getCollection(CURRENCY_COLLECTION);
  return collection.findOne({code});
  // const data: DatabaseType = await readFile();
  // const currency: CurrencyType = data.currenciesList;
  //
  // return {[code]: currency[code]};
};
//
// // POST CreateUser
export const createUser = async (user: DBUser) => {
  const collection = await getCollection(USER_COLLECTION);

  return collection.insertOne(user);

  // await collection.insertOne(user, (err, result) => {
  //
  //   if(err){
  //     console.log('Ошибка создания пользователя');
  //     return console.log(err);
  //   }
  //   console.log(result.ops);
  //   return result.ops;
  //   // client.close();
  // // return await collection.findOne({});
  // });
};

// // POST CreateCountry
export const createCountry = async (country: CountryType) => {
  const collection = await getCollection(COUNTRIES_COLLECTION);

  return collection.insertOne(country);

  // const data: DatabaseType = await readFile();
  // const countries: CountryType[] = data.countriesList;
  //
  // countries.push(country);
  // data.countriesList = countries;
  //
  // await writeFile(data);
  // return country;
};
//
// POST CreateCurrency
export const createCurrency = async (currency: CurrencyType) => {
  const collection = await getCollection(CURRENCY_COLLECTION);

  return collection.insertOne(currency);
  // const data: DatabaseType = await readFile();
  // let currencies: CurrencyType = data.currenciesList;
  // currencies = {...currencies, ...currency};
  // data.currenciesList = currencies;
  //
  // await writeFile(data);
  // return currency;
};

// UPDATE User
export const updateUser = async (user: DBUser) => {
  const collection = await getCollection(USER_COLLECTION);

  const {id} = user;
  return collection.updateOne({id}, user);
};


// DELETE User
export const deleteUser = async (id: string) => {
  const collection = await getCollection(USER_COLLECTION);

  return collection.deleteOne({id});
};
