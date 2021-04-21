const express = require('express')
const router = express.Router()
const Invoice = require('../models/invoice')
const Rental = require('../models/rental')

// all invoices route
router.get('/', async (req, res) => {
    let query = Invoice.find()
    if (req.query.amountUnder != null && req.query.amountUnder != '') {
        query = query.lte('amount', req.query.amountUnder)
    }
    if (req.query.amountAbove != null && req.query.amountAbove != '') {
        query = query.gte('amount', req.query.amountAbove)
    }
    if (req.query.generateBefore != null && req.query.generateBefore != '') {
        query = query.lte('dateGenerated', req.query.generateBefore)
    }
    if (req.query.generateAfter != null && req.query.generateAfter != '') {
        query = query.gte('dateGenerated', req.query.generateAfter)
    }
    try {
        const invoices = await query.exec()
        res.render('invoices/index', {
            invoices: invoices,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new invoice route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Invoice())
})

// create invoice route
router.post('/', async (req, res) => {
    const invoice = new Invoice({
        dateGenerated: new Date(req.body.dateGenerated),
        amount: req.body.amount,
        rental: req.body.rental
    })
    try {
        const newInvoice = await invoice.save()
        res.redirect(`invoices/${newInvoice.id}`)
    } catch {
        renderNewPage(res, invoice, true)
    }
})

// show invoice route
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('rental')
            .exec()
        res.render('invoices/show', { invoice : invoice })
    } catch {
        res.redirect('/')
    }
})

// edit invoice route
router.get('/:id/edit', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
        renderEditPage(res, invoice)
    } catch {
        res.redirect('/')
    }
})

// update invoice route
router.put('/:id', async (req, res) => {
    let invoice
    try {
        invoice = await Invoice.findById(req.params.id)
        invoice.dateGenerated = new Date(req.body.dateGenerated)
        invoice.amount = req.body.amount
        invoice.rental = req.body.rental
        await invoice.save()
        res.redirect(`/invoices/${invoice.id}`)
    } catch {
        if (invoice != null) {
            renderEditPage(res, invoice, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete invoice route
router.delete('/:id', async (req, res) => {
    let invoice
    try {
        invoice = await Invoice.findById(req.params.id)
        await invoice.remove()
        res.redirect('/invoices')
    } catch {
        if (invoice != null) {
            res.render('invoices/show', {
                invoice: invoice,
                errorMessage: 'Could Not Remove Invoice'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, invoice, hasError = false) {
    renderFormPage(res, invoice, 'new', hasError)
}

async function renderEditPage(res, invoice, hasError = false) {
    renderFormPage(res, invoice, 'edit', hasError)
}

async function renderFormPage(res, invoice, form, hasError = false) {
    try {
        const rentals = await Rental.find({})
        const params = {
            rentals: rentals,
            invoice: invoice
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Invoice'
            } else {
                params.errorMessage = 'Error Creating Invoice'
            }
        }
        res.render(`invoices/${form}`, params)
    } catch {
        res.redirect('/invoices')
    }
}

module.exports = router