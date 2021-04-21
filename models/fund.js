const mongoose = require('mongoose')

const fundSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    sponsor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Sponsor'
    }
})

module.exports = mongoose.model('Fund', fundSchema)