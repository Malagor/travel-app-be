import {v4 as uuid} from 'uuid'
import {Router} from "express";
import * as storage from '../storage/travel-app-fs';

const router = Router();

/* GET todos listing. */
router.get('/country', async (req, res) => {
  const list = await storage.getCountriesList();
  res.json(list);
});

router.get('/country/:id', async (req, res) => {
  const item = await storage.getCountryById(req.params['id']);

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

/* POST User listing. */
router.post('/user', async (req, res) => {
  const {body} = req;
  body.id = uuid();

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

/* POST Currency listing. */
router.post('/currency', async (req, res) => {
  const {body} = req;

  const newBody = await storage.createCurrency(body);
  res.json(newBody);
});


//
// /* PUT todos listing. */
// router.put('/:id', async (req, res, next) => {
//   const {body} = req;
//   const newBody = await storage.update({
//     ...body,
//     id: req.params['id']
//   });
//
//
//   res.json(newBody);
// });
//
//
// /* DELETE todos listing. */
// router.delete('/:id', async (req, res, next) => {
//
//   await storage.remove(req.params['id']);
//
//   res
//     .status(204)
//     .json(null);
// });

export default router;
