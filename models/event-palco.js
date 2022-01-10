const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const eventPalcoSchema = new Schema({
  event_id: { type: String, required: true },
  palco_id: { type: String },
  tarifa: { type: String },
  price: { type: Number },
  comision: { type: Number },
  owner_price: { type: Number },
  active: { type: Boolean },
  images: { type: Array },
  inserted_date: { type: Date, default: Date.now },
  modified_date: { type: Date },
});

eventPalcoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('EventPalco', eventPalcoSchema);
