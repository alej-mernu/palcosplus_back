const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const stadiumSchema = new Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    capacity: { type: Number, required: true },
    fundation_date: { type: String },
    local_teams: { type: String },
    description: { type: String },
    location: { type: String },
    zones: { type: String },
    delivery_zone: { type: String },
    access: { type: String },
    /*tarifas: { type: Array },*/
    images: { type: Array },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date }
});

stadiumSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Stadium', stadiumSchema);


