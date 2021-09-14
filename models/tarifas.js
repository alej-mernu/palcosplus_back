const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const TarifasSchema = new Schema({
    tarifas: { type: Array, required: true },
    stadium_id: { type: String, required: true },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date }
});

TarifasSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Tarifas', TarifasSchema);


