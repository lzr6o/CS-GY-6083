const express = require('express')
const router = express.Router()
const Rental = require('../models/rental')
const Customer = require('../models/customer')
const Copy = require('../models/copy')

// all rentals route
router.get('/', async (req, res) => {
    let query = Rental.find()
    if (req.query.status != null && req.query.status != '') {
        query = query.regex('status', new RegExp(req.query.status, 'i'))
    }
    if (req.query.rentAfter != null && req.query.rentBefore != '') {
        query = query.lte('borrowDate', req.query.rentBefore)
    }
    if (req.query.rentAfter != null && req.query.rentAfter != '') {
        query = query.gte('borrowDate', req.query.rentAfter)
    }
    try {
        const rentals = await query.exec()
        res.render('rentals/index', {
            rentals: rentals,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new rental route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Rental())
})

// create rental route
router.post('/', async (req, res) => {
    const rental = new Rental({
        borrowDate: new Date(req.body.borrowDate),
        expectedReturnDate: new Date(req.body.expectedReturnDate),
        actualReturnDate: new Date(req.body.actualReturnDate),
        status: req.body.status,
        copy: req.body.copy,
        customer: req.body.customer
    })
    try {
        const newRental = await rental.save()
        res.redirect(`rentals/${newRental.id}`)
    } catch {
        renderNewPage(res, rental, true)
    }
})

// show rental route
router.get('/:id', async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id)
            .populate('customer')
            .populate('copy')
            .exec()
        res.render('rentals/show', { rental : rental })
    } catch {
        res.redirect('/')
    }
})

// edit rental route
router.get('/:id/edit', async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id)
        renderEditPage(res, rental)
    } catch {
        res.redirect('/')
    }
})

// update rental route
router.put('/:id', async (req, res) => {
    let rental
    try {
        rental = await Rental.findById(req.params.id)
        rental.borrowDate = new Date(req.body.borrowDate)
        rental.expectedReturnDate = new Date(req.body.expectedReturnDate)
        rental.actualReturnDate = new Date(req.body.actualReturnDate)
        rental.status = req.body.status
        rental.copy = req.body.copy
        rental.customer = req.body.customer
        await rental.save()
        res.redirect(`/rentals/${rental.id}`)
    } catch {
        if (rental != null) {
            renderEditPage(res, rental, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete rental route
router.delete('/:id', async (req, res) => {
    let rental
    try {
        rental = await Rental.findById(req.params.id)
        await rental.remove()
        res.redirect('/rentals')
    } catch {
        if (rental != null) {
            res.render('rentals/show', {
                rental: rental,
                errorMessage: 'Could Not Remove Rental'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, rental, hasError = false) {
    renderFormPage(res, rental, 'new', hasError)
}

async function renderEditPage(res, rental, hasError = false) {
    renderFormPage(res, rental, 'edit', hasError)
}

async function renderFormPage(res, rental, form, hasError = false) {
    try {
        const customers = await Customer.find({})
        const copies = await Copy.find({})
        const params = {
            customers: customers,
            copies: copies,
            rental: rental
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Rental'
            } else {
                params.errorMessage = 'Error Creating Rental'
            }
        }
        res.render(`rentals/${form}`, params)
    } catch {
        res.redirect('/rentals')
    }
}

module.exports = router