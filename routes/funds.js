const express = require('express')
const router = express.Router()
const Fund = require('../models/fund')
const Event = require('../models/event')
const Sponsor = require('../models/sponsor')

// all funds route
router.get('/', async (req, res) => {
    let query = Fund.find()
    if (req.query.amountUnder != null && req.query.amountUnder != '') {
        query = query.lte('amount', req.query.amountUnder)
    }
    if (req.query.amountAbove != null && req.query.amountAbove != '') {
        query = query.gte('amount', req.query.amountAbove)
    }
    try {
        const funds = await query.exec()
        res.render('funds/index', {
            funds: funds,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new fund route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Fund())
})

// create fund route
router.post('/', async (req, res) => {
    const fund = new Fund({
        amount: req.body.amount,
        event: req.body.event,
        sponsor: req.body.sponsor
    })
    try {
        const newFund = await fund.save()
        res.redirect(`funds/${newFund.id}`)
    } catch {
        renderNewPage(res, fund, true)
    }
})

// show fund route
router.get('/:id', async (req, res) => {
    try {
        const fund = await Fund.findById(req.params.id)
            .populate('event')
            .populate('sponsor')
            .exec()
        res.render('funds/show', { fund : fund })
    } catch {
        res.redirect('/')
    }
})

// edit fund route
router.get('/:id/edit', async (req, res) => {
    try {
        const fund = await Fund.findById(req.params.id)
        renderEditPage(res, fund)
    } catch {
        res.redirect('/')
    }
})

// update fund route
router.put('/:id', async (req, res) => {
    let fund
    try {
        fund = await Fund.findById(req.params.id)
        fund.event = req.body.event
        fund.sponsor = req.body.sponsor
        fund.amount = req.body.amount
        await fund.save()
        res.redirect(`/funds/${fund.id}`)
    } catch {
        if (fund != null) {
            renderEditPage(res, fund, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete fund route
router.delete('/:id', async (req, res) => {
    let fund
    try {
        fund = await Fund.findById(req.params.id)
        await fund.remove()
        res.redirect('/funds')
    } catch {
        if (fund != null) {
            res.render('funds/show', {
                fund: fund,
                errorMessage: 'Could Not Remove Fund'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, fund, hasError = false) {
    renderFormPage(res, fund, 'new', hasError)
}

async function renderEditPage(res, fund, hasError = false) {
    renderFormPage(res, fund, 'edit', hasError)
}

async function renderFormPage(res, fund, form, hasError = false) {
    try {
        const events = await Event.find({})
        const sponsors = await Sponsor.find({})
        const params = {
            events: events,
            sponsors: sponsors,
            fund: fund
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Fund'
            } else {
                params.errorMessage = 'Error Creating Fund'
            }
        }
        res.render(`funds/${form}`, params)
    } catch {
        res.redirect('/funds')
    }
}

module.exports = router