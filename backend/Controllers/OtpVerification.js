const Request = require("../models/Requests"); // Import your model

exports.OtpVerification = async (req, res) => {
    // console.log("I am requeat",req)
    console.log("request body",req.body)
  try {
    const { customerEmail, serviceProviderEmail, otp } = req.body;
    console.log(customerEmail, serviceProviderEmail, otp)

    // Find the request with the provided customer email, service provider email, and OTP
    const existingRequest = await Request.findOne({
      customermail: customerEmail,
      serviceprovideremail: serviceProviderEmail,
      otp: otp,
    });

    if (!existingRequest) {
        console.log("not exist")
      return res.status(400).json({ message: "Invalid OTP or request not found" });
    }
   

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
