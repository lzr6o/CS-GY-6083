const express = require('express')
const router = express.Router()
const Registration = require('../models/registration')
const Customer = require('../models/customer')
const Event = require('../models/event')

// all registrations route
router.get('/', async (req, res) => {
    let query = Registration.find()
    if (req.query.id != null && req.query.id != '') {
        query = query.regex('id', new RegExp(req.query.id, 'i'))
    }
    try {
        const registrations = await query.exec()
        res.render('registrations/index', {
            registrations: registrations,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new registration route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Registration())
})

// create registration route
router.post('/', async (req, res) => {
    const registration = new Registration({
        customer: req.body.customer,
        event: req.body.event
    })
    try {
        const newRegistration = await registration.save()
        res.redirect(`registrations/${newRegistration.id}`)
    } catch {
        renderNewPage(res, registration, true)
    }
})

// show registration route
router.get('/:id', async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id)
            .populate('customer')
            .populate('event')
            .exec()
        res.render('registrations/show', { registration : registration })
    } catch {
        res.redirect('/')
    }
})

// edit registration route
router.get('/:id/edit', async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id)
        renderEditPage(res, registration)
    } catch {
        res.redirect('/')
    }
})

// update registration route
router.put('/:id', async (req, res) => {
    let registration
    try {
        registration = await Registration.findById(req.params.id)
        registration.customer = req.body.author
        registration.event = req.body.event
        await registration.save()
        res.redirect(`/registrations/${registration.id}`)
    } catch {
        if (registration != null) {
            renderEditPage(res, registration, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete registration route
router.delete('/:id', async (req, res) => {
    let registration
    try {
        registration = await Registration.findById(req.params.id)
        await registration.remove()
        res.redirect('/registrations')
    } catch {
        if (registration != null) {
            res.render('registrations/show', {
                registration: registration,
                errorMessage: 'Could Not Remove Registration'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, registration, hasError = false) {
    renderFormPage(res, registration, 'new', hasError)
}

async function renderEditPage(res, registration, hasError = false) {
    renderFormPage(res, registration, 'edit', hasError)
}

async function renderFormPage(res, registration, form, hasError = false) {
    try {
        const customers = await Customer.find({})
        const events = await Event.find({})
        const params = {
            customers: customers,
            events: events,
            registration: registration
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Registration'
            } else {
                params.errorMessage = 'Error Creating Registration'
            }
        }
        res.render(`registrations/${form}`, params)
    } catch {
        res.redirect('/registrations')
    }
}

module.exports = router