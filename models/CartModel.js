const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const CartItemSchema = mongoose.Schema({
  product: { type: ObjectId, ref: "Book" },
  quantity: Number
},
{ timestamps: true } 
  
);

const CartSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cartContents:  [CartItemSchema],
  amount:  { type: Number }
}, {
  timestamps: true,
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
