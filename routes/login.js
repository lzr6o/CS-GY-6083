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
router.get('/customer/login', async (req, res) => {
    username = req.body.username
    password = req.body.password
    try {
        const customer = await Customer.find({ username: username }, { password: password })
        console.log(customer)
        res.render('admin', {
            customer: customer,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/customer/login')
    }
})

// author login route
router.get('/author/login', async (req, res) => {
    let query = Author.find()
    if (req.query.username != null && req.query.username !== '') {
        query = query.regex('username', new RegExp(req.query.username, 'i'))
    }
    if (req.query.password != null && req.query.password !== '') {
        query = query.regex('password', new RegExp(req.query.password, 'i'))
    }
    try {
        const author = await query.exec()
        res.render('author/index', {
            author: author,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/author/login')
    }
})

module.exports = router