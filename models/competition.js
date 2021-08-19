const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const competitionSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date, default: Date.now }
});

competitionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Competition', competitionSchema);


