import {Collection, MongoClient} from 'mongodb';
import {AttractionType, CountryType, CurrencyType, DBUser, UpdateRatingType} from "./types";

const COUNTRY_PER_PAGE = 8;
const USER_COLLECTION = 'users';
const COUNTRIES_COLLECTION = 'countries';
const CURRENCY_COLLECTION = 'currencies';
const GEO_COLLECTION = 'geo';

const dbName = 'travel-app';
const pass = 'YA4LhInD3NhKn0n2';

const url = `mongodb+srv://root:${pass}@cluster0.tnkge.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const getMongoInstance = async () => {
  let client;
  try {
    client = await MongoClient.connect(url, {
      useUnifiedTopology: true
    });
    return client.db(dbName);
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
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

// GET Geo data
export const getGeo = async () => {
  const collection = await getCollection(GEO_COLLECTION);
  console.log('getGeo');

  return collection.find({}).toArray();
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

// POST CreateAttractions
export const createAttractions = async (countryID: string, attraction: AttractionType) => {
  const collection = await getCollection(COUNTRIES_COLLECTION);
  const country: CountryType = await collection.findOne({id: countryID});
  const countryAttraction = country.attractions;
  countryAttraction.push(attraction);

  const newCountry = {...country, attractions: countryAttraction};
  const result = await collection.replaceOne({id: countryID}, newCountry);
  return result.ops[0];
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

// UPDATE Rating Attraction
export const updateRating = async (data: UpdateRatingType) => {
  const {attractionId, rating, userId, countryId} = data;
  let isUpdate = false;
  let oldRating = 0;

  // add or update rating in UserDate
  const userCollection = await getCollection(USER_COLLECTION);
  const user: DBUser = await userCollection.findOne({id: userId});
  const userAttrArray: { attrId: string; rating: number; }[] = user.attractionRates || [];
  const indexAttr = userAttrArray.findIndex(val => val?.attrId === attractionId);

  if (indexAttr === -1) {
    // add new rating
    userAttrArray.push({attrId: attractionId, rating});
  } else {
    // update rating
    isUpdate = true;
    oldRating = userAttrArray[indexAttr].rating;
    userAttrArray[indexAttr].rating = rating;
  }
  user.attractionRates = userAttrArray;
  await updateUser(user);

  // add or update rating in UserDate
  const countryCollection = await getCollection(COUNTRIES_COLLECTION);
  const country: CountryType = await countryCollection.findOne({id: countryId});
  const countryAttr: AttractionType[] = country.attractions;
  const indexCountryAttr = countryAttr.findIndex(val => val.id === attractionId);

  let newRatingAttr = countryAttr[indexCountryAttr].rating;

  if (isUpdate) {
    newRatingAttr.sum = newRatingAttr.sum - oldRating + rating;
  } else {
    newRatingAttr.sum = newRatingAttr.sum + rating;
    newRatingAttr.count += 1;
  }

  countryAttr[indexCountryAttr].rating = newRatingAttr;
  country.attractions = countryAttr;
  await updateCountry(country);

  return {
    attrId: attractionId,
    countryId: countryId,
    userId: userId,
    userRating: rating,
    attrRating: newRatingAttr};
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
