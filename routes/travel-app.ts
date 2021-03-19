import {v4 as uuid} from 'uuid'
import {Router} from "express";
import * as storage from '../storage/mongo';
import {getUserWhoRateAttraction} from '../storage/mongo';
import {AttractionType} from "../storage/types";

const router = Router();

/* GET listings. */
router.get('/country', async (req, res) => {
  const filter = req.query.filter ? req.query.filter.toString() : "";
  const count = req.query.count ? req.query.count : 0;
  const offset = req.query.offset ? req.query.offset : 0;
  const lang = req.query.lang ? req.query.lang.toString() : 'ru';

  const list = await storage.getCountriesList(+count, +offset, filter, lang);
  res.json(list);
});

// Get Country by Id with attractions rates
router.get('/country/:id', async (req, res) => {
  const country = await storage.getCountryById(req.params['id']);

  const usersArray = await Promise.all(country.attractions.map(async (attr: AttractionType) => {
    return await getUserWhoRateAttraction(attr.id);
  }));

  const newAttr = country.attractions.map(attr => {
    const index = usersArray.findIndex(u => Object.keys(u)[0] === attr.id);
    return {
      ...attr,
      users: usersArray[index][attr.id].users
    };
  });

  const body = {
    ...country,
    attractions: newAttr
  };

  res
    .status(body ? 200 : 404)
    .json(body ?? {
      statusCode: 404
    });
});

// GET Attractions
router.get('/country/:id/attraction', async (req, res) => {
  const item = await storage.getAttractions(req.params['id']);

  res
    .status(item ? 200 : 404)
    .json(item ?? {
      statusCode: 404
    });
});

router.get('/user', async (req, res) => {
  const users = await storage.getUsers();
  res.json(users);
});

router.get('/user/:id', async (req, res) => {
  const user = await storage.getUserInfo(req.params['id']);

  res
    .status(user ? 200 : 404)
    .json(user ?? {
      statusCode: 404
    });
});

router.get('/currency', async (req, res) => {
  const currencies = await storage.getCurrenciesList();
  res.json(currencies);
});

router.get('/currency/:code', async (req, res) => {
  const currency = await storage.getCurrencyByCode(req.params['code']);

  res
    .status(currency ? 200 : 404)
    .json(currency ?? {
      statusCode: 404
    });
});

router.get('/geo', async (req, res) => {
  const geoData = await storage.getGeo();
  res.json(geoData);
});

/* POST User listing. */
router.post('/user', async (req, res) => {
  const {body} = req;

  const newBody = await storage.createUser(body);
  res.json(newBody);
});

/* POST Country listing. */
router.post('/country', async (req, res) => {
  const {body} = req;
  body.id = uuid();

  const newBody = await storage.createCountry(body);
  res.json(newBody);
});

router.post('/country/:id/attraction', async (req, res) => {
  const countryId = req.params['id'];
  const {body} = req;
  body.id = uuid();
  body.rating = {"sum": 0, "count": 0};

  await storage.createAttractions(countryId, body);
  res.json(body);
});

/* POST Currency listing. */
router.post('/currency', async (req, res) => {
  const {body} = req;

  const newBody = await storage.createCurrency(body);
  res.json(newBody);
});


/* PUT User listing. */
router.put('/user', async (req, res) => {
  const {body} = req;
  const newBody = await storage.updateUser({
    ...body
  });


  res.json(newBody);
});

/* PUT Country listing. */
router.put('/country', async (req, res) => {
  const {body} = req;
  const newBody = await storage.updateCountry({
    ...body
  });


  res.json(newBody);
});

router.put('/country/:id/attraction', async (req, res) => {
  const {body} = req;
  body.countryId = req.params['id'];
  let newRating;

  try {
    newRating = await storage.updateRating({...body});
  } catch (e) {
    console.log(e.message);
    res.json('Error');
  }

  res.json(newRating);

});


/* DELETE User */
router.delete('/user/:id', async (req, res) => {

  await storage.deleteUser(req.params['id']);

  res
    .status(204)
    .json(null);
});

router.delete('/currency/:code', async (req, res) => {

  await storage.deleteCurrency(req.params['code']);

  res
    .status(204)
    .json(null);
});

router.patch('/user/:id/lang', async (req, res) => {

  const {body} = req;
  body.userId = req.params['id'];

  let newUserData;
  try {
    newUserData = await storage.updateLanguage({...body});
  } catch (e) {
    console.log(e.message);
    res.json('Error');
  }

  res.json(newUserData);
});

export default router;
