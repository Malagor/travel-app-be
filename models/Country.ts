import {Schema, model} from 'mongoose';
import * as Languages from './Languages'

const schema = new Schema({
  id: String,
  name: Languages,
  capital: Languages,
  currency: String,
  description: Languages,
  population: Number,
  area: Number,
  languages: [String],
  videos: [String],
  photos: [String],
  locale: String,
  timeZone: String,
});


module.exports = model('Country', schema);
