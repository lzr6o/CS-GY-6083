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
        type: String,
        default: null
    },
    cardNumber: {
        type: Number,
        default: null
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
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