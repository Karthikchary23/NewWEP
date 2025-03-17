const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customermodel');
exports.CustomerLogin = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  try {
    const customer = await Customer.findOne({ email });
    // console.log(customer);
    if (!customer) {
      return res.status(400).json({ message: 'Email not found' });
    }
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    // console.log("password matched");
    const token = jwt.sign({ id: customer._id,email:customer.email,password:customer.password }, process.env.JWT_SECRET);
    // console.log(token);
    res.status(200).json({ token });
    } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    }
}