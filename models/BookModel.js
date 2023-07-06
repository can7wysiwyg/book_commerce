const mongoose = required('mongoose')

const BookSchema = mongoose.Schema({
    bookTitle: {
        type: String,
        required: true
    },
    bookImage: {
        type: String,
        required: true
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
        required: true
    },
    bookReleaseDate: {
        type: Date,
        required: true
    },
    bookAuthor: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})


module.exports = mongoose.model('Book', BookSchema)