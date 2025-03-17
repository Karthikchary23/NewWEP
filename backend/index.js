const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ServiceproviderRoutes = require('./routes/ServiceproviderRoutes');
const OtpRoutes = require('./routes/OtpRoutes');
const CustomerRoutes = require('./routes/CustomerRoutes');
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => { console.log(err); });

app.use('/service-provider', ServiceproviderRoutes);
app.use('/otp',OtpRoutes);
app.use('/customer',CustomerRoutes);
app.use('/serviceprovidersigninotp',OtpRoutes)
app.use("/serviceprovider", ServiceproviderRoutes);
app.use("/customersigninotp", CustomerRoutes);
app.use("/customer", CustomerRoutes);
app.use("/serviceprovidertoken", ServiceproviderRoutes);
app.use("/customertoken", CustomerRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});