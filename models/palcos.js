const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const palcoSchema = new Schema({
  name: { type: String },
  type: { type: String },
  zone: { type: String },
  access: { type: String },
  num_cards: { type: Number },
  description: { type: String },
  price: { type: Number },
  owner_price: { type: Number },
  stadium_id: { type: String },
  comision: { type: String },
  active: { type: Boolean },
  user_id: { type: String },
  isImportant: { type: Boolean, default: false },
  images: { type: Array },
  inserted_date: { type: Date, default: Date.now },
  modified_date: { type: Date },
});

palcoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Palcos', palcoSchema);
