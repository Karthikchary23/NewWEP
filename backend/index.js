const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ServiceproviderRoutes = require('./routes/ServiceproviderRoutes');
const OtpRoutes = require('./routes/OtpRoutes');
const CustomerRoutes = require('./routes/CustomerRoutes');
const RequestRouter = require('./routes/RequestRouter');
const socketConfig = require("./socket"); // Import socket configuration
const http = require("http"); // ✅ Add this line
const requests=require("../backend/models/Requests")

dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app); // Create HTTP server

app.get('/', (req, res) => {
  res.send('Hello World!');
});
socketConfig.init(server);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => { console.log(err); });

app.use('/service-provider', ServiceproviderRoutes);
app.use('/otp', OtpRoutes);
app.use('/customer', CustomerRoutes);
app.use('/serviceprovidersigninotp', OtpRoutes);
app.use("/serviceprovider", ServiceproviderRoutes);
app.use("/customersigninotp", CustomerRoutes);
app.use("/customertoken", CustomerRoutes);
app.use("/serviceprovidertoken", ServiceproviderRoutes);
app.use("/request",RequestRouter)
app.use("/available",ServiceproviderRoutes)
app.use("/serviceproviderlocation",ServiceproviderRoutes)
app.use("/customerlocation",CustomerRoutes)
// app.use('/request',RequestRouter)


server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});