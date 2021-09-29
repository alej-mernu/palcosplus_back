const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const rentSchema = new Schema({
    name: { type: String },
    last_name: { type: String },
    email: { type: String },
    tel: { type: Number },
    //address
    alias: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    suburb: { type: String },
    postal_code: { type: String },
    address: { type: String },
    interior_num: { type: String },
    palco_id: { type: String },
    event_id: { type: String },
    active: {type: Boolean},
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date }
});

rentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Rent', rentSchema);


