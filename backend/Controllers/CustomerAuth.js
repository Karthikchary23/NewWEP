const bcrypt = require('bcryptjs');
const Customer = require('../models/Customermodel');

exports.customerSignUp = async (req, res) => {
    try {
        const { name, email, phone, Fulladdress, city, postalCode, country, password } = req.body;
        const customer = await Customer.findOne({ email });
        console.log('customer data');
        console.log(customer);
        if (customer) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);  // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password with the salt
        const newCustomer = new Customer({
            name, email, phone, Fulladdress, city, postalCode, country, password: hashedPassword
        });
        await newCustomer.save();   // Save the new customer to the database
        res.status(200).json({ message: 'User created successfully' }); // Send success response    
    }
    catch (error) {
        res.status(500).json({ message: error.message });  // Send error response
    }   
}