const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const Author = require('../models/author')

router.get('/', async (req, res) => {
    res.render('login')
})

router.get('/customer', async (req, res) => {
    res.render('login/customer')
})

router.get('/author', async (req, res) => {
    res.render('login/author')
})

// customer login route
router.post('/customer', async (req, res) => {
    var username = req.body.username
    var password = req.body.password
    Customer.find({ username: username, password: password }, function(err, user) {
        if (err) {
            return res.status(500).send()
        }
        if (!user) {
            return res.status(404).send()
        }
        res.redirect('../customer')
    })
})

// author login route
router.post('/author', async (req, res) => {
    var username = req.body.username
    var password = req.body.password
    try {
        author = await Author.find({ username: username, password: password })
        console.log(author)
        if (author) {
            res.redirect('../author')
        }
        else {
            res.render('login/author', {
                errorMessage: 'User Not Find'
            })
        }
    } catch {
        res.redirect('/login/author')
    }
})

module.exports = router