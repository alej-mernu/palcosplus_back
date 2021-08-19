const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const teamSchema = new Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    stadium_id: { type: String, required: true },
    principal_color: { type: String, required: true },
    secundary_color: { type: String, required: true },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date, default: Date.now }
});

teamSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Teams', teamSchema);


