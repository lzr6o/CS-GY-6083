const express = require('express')
const router = express.Router()
const Payment = require('../models/payment')
const Customer = require('../models/customer')

// all payments route
router.get('/', async (req, res) => {
    let query = Payment.find()
    if (req.query.method != null && req.query.method != '') {
        query = query.regex('method', new RegExp(req.query.method, 'i'))
    }
    if (req.query.amountUnder != null && req.query.amountUnder != '') {
        query = query.lte('amount', req.query.amountUnder)
    }
    if (req.query.amountAbove != null && req.query.amountAbove != '') {
        query = query.gte('amount', req.query.amountAbove)
    }
    if (req.query.payBefore != null && req.query.payBefore != '') {
        query = query.lte('payDate', req.query.payBefore)
    }
    if (req.query.payAfter != null && req.query.payAfter != '') {
        query = query.gte('payDate', req.query.payAfter)
    }
    try {
        const payments = await query.exec()
        res.render('payments/index', {
            payments: payments,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new payment route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Payment())
})

// create payment route
router.post('/', async (req, res) => {
    const payment = new Payment({
        method: req.body.method,
        customer: req.body.customer,
        payDate: new Date(req.body.payDate),
        amount: req.body.amount,
        cardHolderName: req.body.cardHolderName,
        cardNumber: req.body.cardNumber,
        cardExpirationDate: new Date(req.body.cardExpirationDate)
    })
    try {
        const newPayment = await payment.save()
        res.redirect(`payments/${newPayment.id}`)
    } catch {
        renderNewPage(res, payment, true)
    }
})

// show payment route
router.get('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('customer')
            .exec()
        res.render('payments/show', { payment : payment })
    } catch {
        res.redirect('/')
    }
})

// edit payment route
router.get('/:id/edit', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
        renderEditPage(res, payment)
    } catch {
        res.redirect('/')
    }
})

// update payment route
router.put('/:id', async (req, res) => {
    let payment
    try {
        payment = await Payment.findById(req.params.id)
        payment.method = req.body.method
        payment.customer = req.body.customer
        payment.payDate = new Date(req.body.payDate)
        payment.amount = req.body.amount
        payment.cardHolderName = req.body.cardHolderName
        payment.cardNumber = req.body.cardNumber
        payment.cardExpirationDate = new Date(req.body.cardExpirationDate)
        await payment.save()
        res.redirect(`/payments/${payment.id}`)
    } catch {
        if (payment != null) {
            renderEditPage(res, payment, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete payment route
router.delete('/:id', async (req, res) => {
    let payment
    try {
        payment = await Payment.findById(req.params.id)
        await payment.remove()
        res.redirect('/payments')
    } catch {
        if (payment != null) {
            res.render('payments/show', {
                payment: payment,
                errorMessage: 'Could Not Remove Payment'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, payment, hasError = false) {
    renderFormPage(res, payment, 'new', hasError)
}

async function renderEditPage(res, payment, hasError = false) {
    renderFormPage(res, payment, 'edit', hasError)
}

async function renderFormPage(res, payment, form, hasError = false) {
    try {
        const customers = await Customer.find({})
        const params = {
            customers: customers,
            payment: payment
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Payment'
            } else {
                params.errorMessage = 'Error Creating Payment'
            }
        }
        res.render(`payments/${form}`, params)
    } catch {
        res.redirect('/payments')
    }
}

module.exports = router