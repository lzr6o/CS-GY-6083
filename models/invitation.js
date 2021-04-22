const mongoose = require('mongoose')

const invitationSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    }
})

module.exports = mongoose.model('Invitation', invitationSchema)