const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    payDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    cardHolderName: {
        type: String
    },
    cardNumber: {
        type: Number
    },
    cardExpirationDate: {
        type: Date
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    }
})

module.exports = mongoose.model('Payment', paymentSchema)