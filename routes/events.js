const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const Topic = require('../models/topic')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// all events route
router.get('/', async (req, res) => {
    let query = Event.find()
    if (req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if (req.query.type != null && req.query.type != '') {
        query = query.regex('type', new RegExp(req.query.type, 'i'))
    }
    if (req.query.endBefore != null && req.query.endBefore != '') {
        query = query.lte('endTime', req.query.endBefore)
    }
    if (req.query.startAfter != null && req.query.startAfter != '') {
        query = query.gte('startTime', req.query.startAfter)
    }
    try {
        const events = await query.exec()
        res.render('events/index', {
            events: events,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new event route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Event())
})

// create event route
router.post('/', async (req, res) => {
    const event = new Event({
        name: req.body.name,
        type: req.body.type,
        topic: req.body.topic,
        description: req.body.description,
        expense: req.body.expense,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime)
    })
    saveCover(event, req.body.cover)
    try {
        const newEvent = await event.save()
        res.redirect(`events/${newEvent.id}`)
    } catch {
        renderNewPage(res, event, true)
    }
})

// show event route
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('topic')
            .exec()
        res.render('events/show', { event: event })
    } catch {
        res.redirect('/')
    }
})

// edit event route
router.get('/:id/edit', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        renderEditPage(res, event)
    } catch {
        res.redirect('/')
    }
})

// update event route
router.put('/:id', async (req, res) => {
    let event
    try {
        event = await Event.findById(req.params.id)
        event.name = req.body.name
        event.type = req.body.type
        event.topic = req.body.topic
        event.description = req.body.description
        event.expense = req.body.expense
        event.startTime = req.body.startTime
        event.endTime = req.body.endTime
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(event, req.body.cover)
        }
        await event.save()
        res.redirect(`/events/${event.id}`)
    } catch {
        if (event != null) {
            renderEditPage(res, event, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete event route
router.delete('/:id', async (req, res) => {
    let event
    try {
        event = await Event.findById(req.params.id)
        await event.remove()
        res.redirect('/events')
    } catch {
        if (event != null) {
            res.render('events/show', {
                event: event,
                errorMessage: 'Could Not Remove Event'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, event, hasError = false) {
    renderFormPage(res, event, 'new', hasError)
}

async function renderEditPage(res, event, hasError = false) {
    renderFormPage(res, event, 'edit', hasError)
}

async function renderFormPage(res, event, form, hasError = false) {
    try {
        const topics = await Topic.find({})
        const params = {
            topics: topics,
            event: event
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Event'
            } else {
                params.errorMessage = 'Error Creating Event'
            }
        }
        res.render(`events/${form}`, params)
    } catch {
        res.redirect('/events')
    }
}

function saveCover(event, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        event.coverImage = new Buffer.from(cover.data, 'base64')
        event.coverImageType = cover.type
    }
}

module.exports = router