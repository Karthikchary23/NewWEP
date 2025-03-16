const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, email:{
        type: String,
        required: true
    }, phone:{
        type: Number,
        required: true
    }, Fulladdress:{
        type: String,
        required: true
    }, city:{
        type: String,
        required: true
    }, postalCode:{
        type: String,
        required: true
    }, country:{
        type: String,
        required: true
    }, password:{
        type: String,
        required: true
    }, isCustomer:{
        type: Boolean,
        required: true,
        default: true
    }, isServiceProvider:{
        type: Boolean,
        required: true,
        default: false
    }, resetPasswordOTP:{
        type: Number
    }, customerVerificationOTP:{
        type: Number
    }, ratings:{
        type: Number,
        default: 0
    }, serviceProvidedCount:{
        type: Number,
        default: 0
    },
})
const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer; // Use module.exports instead of export default Customer;
