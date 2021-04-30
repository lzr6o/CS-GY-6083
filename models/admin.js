const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        default: "ADMIN"
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Admin', adminSchema)