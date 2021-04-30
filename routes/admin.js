const express = require('express')
const router = express.Router()
const Admin = require('../models/admin')

// create admin
let admin = new Admin({
    username: "lzr6o",
    password: "Qaq$2631",
    fullName: "Zhengrui Li"
})
admin.save()

// admin login route
router.get('/login', (req, res) => {
    res.render('admin/login')
})

// admin login route
router.post('/login', async (req, res) => {
    var username = req.body.username
    var password = req.body.password
    const admin = await Admin.findOne({ username: username, password: password })
    if (!admin) {
        res.render('admin/login', { errorMessage: 'Error Login in' })
    }
    else {
        res.render('admin', { admin: admin })
    }
})

module.exports = router