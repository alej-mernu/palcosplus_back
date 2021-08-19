const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const eventSchema = new Schema({
    places: { type: String, required: true },
    disponibility: { type: String, required: true },
    type: { type: String, required: true },
    home: { type: String },
    visitor: { type: String },
    name: { type: Number },
    tour_name: { type: Number },
    date: { type: String, required: true },
    time: { type: Number },
    jornada: { type: Boolean, required: true },
    competition_id: { type: String, required: true },
    stadium_id: { type: String, required: true },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date, default: Date.now }
});

eventSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Evento', eventSchema);


