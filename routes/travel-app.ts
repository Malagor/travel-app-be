import {v4 as uuid} from 'uuid'
import {Router} from "express";
import * as storage from '../storage/mongo';

const router = Router();

/* GET listings. */
router.get('/country', async (req, res) => {
  // console.log('req.params["count"]', req.params['count']);
  const filter = req.query.filter? req.query.filter.toString(): "";
  const count = req.query.count ? req.query.count : 0;
  const offset = req.query.offset ? req.query.offset : 0;
  const lang = req.query.lang ? req.query.lang.toString() : 'ru';

  const list = await storage.getCountriesList(+count, +offset, filter, lang);
  console.log('list', list);
  res.json(list);
});
//
router.get('/country/:id', async (req, res) => {
  const item = await storage.getCountryById(req.params['id']);

  res
    .status(item ? 200 : 404)
    .json(item ?? {
      statusCode: 404
    });
});

router.get('/user', async (req, res) => {
  console.log('GET USERS');
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

// /* POST User listing. */
router.post('/user', async (req, res) => {
  const {body} = req;
  body.id = uuid();

  const newBody = await storage.createUser(body);
  res.json(newBody);
});

// /* POST Country listing. */
router.post('/country', async (req, res) => {
  const {body} = req;
  body.id = uuid();

  const newBody = await storage.createCountry(body);
  res.json(newBody);
});
//
// /* POST Currency listing. */
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

export default router;
