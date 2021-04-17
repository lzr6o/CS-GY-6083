const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// all customers route
router.get('/', async (req, res) => {
    let query = Customer.find()
    if (req.query.name != null && req.query.name !== '') {
        query = query.regex('fullName', new RegExp(req.query.name, 'i'))
    }
    try {
        const customers = await query.exec()
        res.render('customers/index', {
            customers: customers,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new customer route
router.get('/new', async (req, res) => {
    res.render('customers/new', { customer: new Customer() })
})

// create customer route
router.post('/', async (req, res) => {
    const customer = new Customer({
        username: req.body.username,
        password: req.body.password,
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
    saveCover(customer, req.body.cover)
    try {
        const newCustomer = await customer.save()
        res.redirect(`customers/${newCustomer.id}`)
    } catch {
        res.render('customers/new', {
            customer: customer,
            errorMessage: 'Error Creating Customer'
        })
    }
})

// show customer route
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
        res.render('customers/show', { customer: customer })
    } catch {
        res.redirect('/')
    }
})

// edit customer route
router.get('/:id/edit', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
        res.render('customers/edit', { customer: customer })
    } catch {
        res.redirect('/customers')
    }
})

// update customer route
router.put('/:id', async (req, res) => {
    let customer
    try {
        customer = await Customer.findById(req.params.id)
        customer.username = req.body.username
        customer.password = req.body.password
        customer.fullName = req.body.firstName + ' ' + req.body.lastName
        customer.firstName = req.body.firstName
        customer.lastName = req.body.lastName
        customer.gender = req.body.gender
        customer.email = req.body.email
        customer.phone = req.body.phone
        customer.street = req.body.street
        customer.city = req.body.city
        customer.zipcode = req.body.zipcode
        customer.state = req.body.state
        customer.country = req.body.country
        customer.identificationType = req.body.identificationType
        customer.identificationNumber = req.body.identificationNumber
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(customer, req.body.cover)
        }
        await customer.save()
        res.redirect(`customers/${Customer.id}`)
    } catch {
        if (customer == null) {
            res.redirect('/')
        } else {
            res.render('customers/edit', {
                customer: customer,
                errorMessage: 'Error Updating Customer'
            })
        }
    }
})

// delete customer route
router.delete('/:id', async (req, res) => {
    let customer
    try {
        customer = await Customer.findById(req.params.id)
        await customer.remove()
        res.redirect('/customers')
    } catch {
        if (customer == null) {
            res.redirect('/')
        } else {
            res.redirect(`/customers/${customer.id}`)
        }
    }
})

function saveCover(customer, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        customer.coverImage = new Buffer.from(cover.data, 'base64')
        customer.coverImageType = cover.type
    }
}

module.exports = router