import mongoose from 'mongoose';
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
        default: false
    }
})
const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;