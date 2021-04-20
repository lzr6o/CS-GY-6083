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
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    cardExpirationDate: {
        type: Date
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Invoice'
    }
})

module.exports = mongoose.model('Payment', paymentSchema)