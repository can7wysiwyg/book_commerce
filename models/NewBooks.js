const mongoose = require('mongoose')

NewBookSchema = mongoose.Schema({
    bookTitle: {
        type: String,
        required: true
    },
    bookImage: {
        type: String,

    }, 
    bookDescription: {
        type: String,
        required: true
    },
    bookGenre: {
        type: String,
        required: true
    },
    bookPrice: {
        type: String,
    
    },
    bookReleaseDate: {
        type: Date,

    },
    bookAuthor: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})


module.exports = mongoose.model('NewBook', NewBookSchema)