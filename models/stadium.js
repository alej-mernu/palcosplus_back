const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const stadiumSchema = new Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    capacity: { type: Number, required: true },
    fundation_date: { type: String },
    local_teams: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    fundation: { type: String },
    zones: { type: String },
    access: { type: String },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date, default: Date.now }
});

stadiumSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Stadium', stadiumSchema);


