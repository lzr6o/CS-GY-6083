const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const bcrypt = require('bcrypt')

router.get('/', async (req, res) => {
    res.render('register')
})

router.get('/customer', async (req, res) => {
    res.render('register/customer')
})

router.get('/author', async (req, res) => {
    res.render('register/author')
})

// customer register route
router.post('/customer', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const customer = new Customer({
        username: req.body.username,
        password: hashedPassword,
        fullName: req.body.firstName + ' ' + req.body.lastName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        email: req.body.email,
        phone: req.body.phone,
        street: req.body.street,
        city: req.body.city,
        zipcode: req.body.zipcode,
        state: req.body.state,
        country: req.body.country,
        identificationType: req.body.identificationType,
        identificationNumber: req.body.identificationNumber
    })
    saveCustomerCover(customer, req.body.cover)
    try {
        await customer.save()
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

function saveCustomerCover(customer, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        customer.coverImage = new Buffer.from(cover.data, 'base64')
        customer.coverImageType = cover.type
    }
}

// author register route
router.post('/author', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const author = new Author({
        username: req.body.username,
        password: hashedPassword,
        fullName: req.body.firstName + ' ' + req.body.lastName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        email: req.body.email,
        phone: req.body.phone,
        street: req.body.street,
        city: req.body.city,
        zipcode: req.body.zipcode,
        state: req.body.state,
        country: req.body.country
    })
    saveAuthorCover(author, req.body.cover)
    try {
        await author.save()
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

function saveAuthorCover(author, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        author.coverImage = new Buffer.from(cover.data, 'base64')
        author.coverImageType = cover.type
    }
}

module.exports = router