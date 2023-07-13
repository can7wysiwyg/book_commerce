const CartRoute = require('express').Router();
const Cart = require('../models/CartModel');
const asyncHandler = require('express-async-handler');


CartRoute.post('/cartt/make_order', asyncHandler(async (req, res) => {
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

   await transport.sendMail({
        from: 'tristankasusa@outlook.com',
        to: email,
       subject: 'You Have Placed An Order',
       html: '<h1>Hello world!</h1>'
     });

   
    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error placing the order' });
  }
}));



module.exports = CartRoute;
