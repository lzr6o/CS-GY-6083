const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    timeslot: {
        type: String,
        required: true
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
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    }
})

module.exports = mongoose.model('Reservation', reservationSchema)