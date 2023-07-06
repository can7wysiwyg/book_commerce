const mongoose = require('mongoose')

const GenreSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    }


}, {
    timestamps: true
})

module.exports = mongoose.model('Genre', GenreSchema)