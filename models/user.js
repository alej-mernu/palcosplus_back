const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    address: { type: String, required: true },
    tel: { type: Number, required: true },
    date_birth: { type: String, required: true },
    role: { type: String, required: true },
    inserted_date: { type: Date, default: Date.now },
    modified_date: { type: Date, default: Date.now }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


