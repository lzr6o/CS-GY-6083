const mongoose = require('mongoose')

const rentalSchema = new mongoose.Schema({
    borrowDate: {
        type: Date,
        required: true
    },
    expectedReturnDate: {
        type: Date,
        required: true
    },
    actualReturnDate: {
        type: Date,
        required: true
    },
    rentalStatus: {
        type: String,
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    }
})

module.exports = mongoose.model('Rental', rentalSchema)