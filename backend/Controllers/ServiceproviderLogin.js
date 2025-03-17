const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ServiceProvider = require('../models/Serviceprovider');

exports.ServiceproviderSignin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const serviceProvider = await ServiceProvider.findOne({ email });
    // console.log(serviceProvider);
    if (!serviceProvider) {
      return res.status(400).json({ message: 'Email not found' });
    }
    const isMatch = await bcrypt.compare(password, serviceProvider.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    console.log("password matched");
    const token = jwt.sign({ id: serviceProvider._id,email:serviceProvider.email,password:serviceProvider.password }, process.env.JWT_SECRET);
    // console.log(token);
    res.status(200).json({ token });
    } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    }
}