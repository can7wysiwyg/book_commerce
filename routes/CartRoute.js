const CartRoute = require('express').Router();
const Cart = require('../models/CartModel');
const asyncHandler = require('express-async-handler');
const verify = require('../middleware/verify')
const authAdmin = require('../middleware/authAdmin')


CartRoute.post('/cartt/make_order', asyncHandler(async (req, res, next) => {


  try {


    const {cartContents, fullname, email, phonenumber, address, amount } = req.body


  if(!cartContents) {
    throw new Error("Cart Cannot Be Empty");

  }

  if(!fullname) {
    throw new Error("Name cannot be empty");

  }

  if(!email) {
    throw new Error("Email cannot be empty");

  }

  if(!address) {
    throw new Error("Address cannot be empty");

  }

  if(!phonenumber) {
    throw new Error("Phone Number cannot be empty");

  }


  const results = await Cart.create({
    cartContents,
    fullname,
    email,
    address,
    amount,
    phonenumber
  })

res.json({results})



    
  } catch (error) {
    next(error)
  }

  


  }));


  CartRoute.get('/cartt/show_carts', verify, authAdmin, asyncHandler(async(req, res, next) => {
try {

  const carts = await Cart.find().sort({ _id: -1 })

  res.json({carts})
  
} catch (error) {
  next(error)
}


  }))


  CartRoute.delete('/cartt/delete_cart/:id', verify, authAdmin, asyncHandler(async(req, res, next) => {

    try {

      await Cart.findByIdAndDelete(req.params.id)

      res.json({msg: "cart has been deleted...."})
      
    } catch (error) {
      next(error)
    }

  }))


module.exports = CartRoute;
