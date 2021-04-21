const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    dateGenerated: {
        type: Date
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    rental: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Rental'
    }
})

module.exports = mongoose.model('Invoice', invoiceSchema)