const CartRoute = require('express').Router();
const Cart = require('../models/CartModel');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');

// Create a transport object for nodemailer
const transporter = nodemailer.createTransport({
  
    host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM',
    pass: 'REPLACE-WITH-YOUR-GENERATED-PASSWORD'
  }


});

CartRoute.post('/cart/make_order', asyncHandler(async (req, res) => {
  // Get the cart contents and user details from the request body
  const { cartContents, fullname, email, address, phonenumber } = req.body;

  try {
    // Create a new cart document in the database
    const newCart = new Cart({
      fullname,
      email,
      phonenumber,
      address,
      cartContents,
    });

    // Save the cart to the database
    await newCart.save();

    // Send email notification to the user
    // await transporter.sendMail({
    //   from: 'paulkssa@gmail.com',
    //   to: email,
    //   subject: 'Order Confirmation',
    //   text: 'Your order has been placed successfully.',
    // });

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error placing the order' });
  }
}));

module.exports = CartRoute;
