const express = require('express')
const router = express.Router()
const Reservation = require('../models/reservation')
const Customer = require('../models/customer')
const Room = require('../models/room')

// all reservations route
router.get('/', async (req, res) => {
    let query = Reservation.find()
    if (req.query.timeslot != null && req.query.timeslot != '') {
        query = query.regex('timeslot', new RegExp(req.query.timeslot, 'i'))
    }
    if (req.query.reserveBefore != null && req.query.reserveBefore != '') {
        query = query.lte('date', req.query.reserveBefore)
    }
    if (req.query.reserveAfter != null && req.query.reserveAfter != '') {
        query = query.gte('date', req.query.reserveAfter)
    }
    try {
        const reservations = await query.exec()
        res.render('reservations/index', {
            reservations: reservations,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new reservation route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Reservation())
})

// create reservation route
router.post('/', async (req, res) => {
    const reservation = new Reservation({
        date: new Date(req.body.date),
        timeslot: req.body.timeslot,
        customer: req.body.customer,
        room: req.body.room
    })
    try {
        console.log(reservation)
        const newReservation = await reservation.save()
        res.redirect(`reservations/${newReservation.id}`)
    } catch {
        renderNewPage(res, reservation, true)
    }
})

// show reservation route
router.get('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('room')
            .populate('customer')
            .exec()
        res.render('reservations/show', { reservation : reservation })
    } catch {
        res.redirect('/')
    }
})

// edit reservation route
router.get('/:id/edit', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
        renderEditPage(res, reservation)
    } catch {
        res.redirect('/')
    }
})

// update reservation route
router.put('/:id', async (req, res) => {
    let reservation
    try {
        reservation = await Reservation.findById(req.params.id)
        reservation.date = new Date(req.body.date)
        reservation.timeslot = req.body.timeslot
        reservation.customer = req.body.customer
        reservation.room = req.body.room
        await reservation.save()
        res.redirect(`/reservations/${reservation.id}`)
    } catch {
        if (reservation != null) {
            renderEditPage(res, reservation, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete reservation route
router.delete('/:id', async (req, res) => {
    let reservation
    try {
        reservation = await Reservation.findById(req.params.id)
        await reservation.remove()
        res.redirect('/reservations')
    } catch {
        if (reservation != null) {
            res.render('reservations/show', {
                reservation: reservation,
                errorMessage: 'Could Not Remove Reservation'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, reservation, hasError = false) {
    renderFormPage(res, reservation, 'new', hasError)
}

async function renderEditPage(res, reservation, hasError = false) {
    renderFormPage(res, reservation, 'edit', hasError)
}

async function renderFormPage(res, reservation, form, hasError = false) {
    try {
        const rooms = await Room.find({})
        const customers = await Customer.find({})
        const params = {
            rooms: rooms,
            customers: customers,
            reservation: reservation
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Reservation'
            } else {
                params.errorMessage = 'Error Creating Reservation'
            }
        }
        res.render(`reservations/${form}`, params)
    } catch {
        res.redirect('/reservations')
    }
}

module.exports = router