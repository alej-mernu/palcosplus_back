const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const palcoSchema = new Schema({
    name: { type: String, required: true },
    level: { type: String, required: true },
    zone: { type: String, required: true },
    num_cards: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number },
    active: { type: Boolean, required: true },
    stadium_id: { type: String },
    user_id: { type: String, required: true },
    access: { type: String, required: true },
    comision: { type: Number, required: true },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date, default: Date.now }
});

palcoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Palcos', palcoSchema);


