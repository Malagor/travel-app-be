import {Schema, model} from 'mongoose';

const schema = new Schema({
  en: String,
  ru: String,
  be: String,
});


module.exports = model('Languages', schema);
