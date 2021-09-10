const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, unique: true },
    tel: { type: Number },
    date_birth: { type: String },
    password: { type: String },
    image: { type: String },
    role: { type: String },
    origin: { type: String },
    //address
    alias: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    suburb: { type: String },
    postal_code: { type: String },
    address: { type: String },
    interior_num: { type: String },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


