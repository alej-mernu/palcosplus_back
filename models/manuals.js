const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const manualSchema = new Schema({
  name: { type: String },
  location: { type: String },
  inserted_date: { type: Date, default: Date.now },
  modified_date: { type: Date },
});

manualSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Manuals', manualSchema);
