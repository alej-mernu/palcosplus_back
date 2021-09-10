const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const eventSchema = new Schema({
    type: { type: String, required: true },
    home: { type: String },
    visitor: { type: String },
    name: { type: String },
    tour_name: { type: String },
    event_color: { type: String },
    date: { type: String, required: true },
    time: { type: String },
    jornada: { type: String },
    competition_id: { type: String },
    images: { type: Array },
    stadium_id: { type: String, required: true },
    isImportant: { type: Boolean, default: false },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date }
});

eventSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Evento', eventSchema);


