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
        type: Date
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    copy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Copy'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    }
})

module.exports = mongoose.model('Rental', rentalSchema)