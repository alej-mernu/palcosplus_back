const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const competitionSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    jornadas: { type: String },
    images: { type: Array },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date }
});

competitionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Competition', competitionSchema);


