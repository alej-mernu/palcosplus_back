const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const reservationSchema = new Schema({
    aviability_date: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
    event_id: { type: String, required: true },
    palco_id: { type: String, required: true },
    user_id: { type: String, required: true },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date }
});

reservationSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Reservation', reservationSchema);


