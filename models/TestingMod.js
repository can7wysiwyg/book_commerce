const mongoose = require('mongoose')

const TestSchema = mongoose.Schema({
testImage: {
    type: String
}


}, {
    timestamps: true
})


module.exports = mongoose.model('Testo', TestSchema)