const mongoose = require('mongoose')

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
    cartContents: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Cart', CartSchema)