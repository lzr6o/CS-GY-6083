const express = require('express')
const router = express.Router()
const Room = require('../models/room')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// all rooms route
router.get('/', async (req, res) => {
    let query = Room.find()
    if (req.query.number != null && req.query.number != '') {
        query = query.regex('number', new RegExp(req.query.number, 'i'))
    }
    try {
        const rooms = await query.exec()
        res.render('rooms/index', {
            rooms: rooms,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new room route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Room())
})

// create room route
router.post('/', async (req, res) => {
    const room = new Room({
        number: req.body.number,
        capacity: req.body.capacity
    })
    saveCover(room, req.body.cover)
    try {
        const newRoom = await room.save()
        res.redirect(`rooms/${newRoom.id}`)
    } catch {
        renderNewPage(res, room, true)
    }
})

// show room route
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
        res.render('rooms/show', { room: room })
    } catch {
        res.redirect('/')
    }
})

// edit room route
router.get('/:id/edit', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
        renderEditPage(res, room)
    } catch {
        res.redirect('/')
    }
})

// update room route
router.put('/:id', async (req, res) => {
    let room
    try {
        room = await Room.findById(req.params.id)
        room.number = req.body.number
        room.capacity = req.body.capacity
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(room, req.body.cover)
        }
        await room.save()
        res.redirect(`/rooms/${room.id}`)
    } catch {
        if (room != null) {
            renderEditPage(res, room, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete room route
router.delete('/:id', async (req, res) => {
    let room
    try {
        room = await Room.findById(req.params.id)
        await room.remove()
        res.redirect('/rooms')
    } catch {
        if (room != null) {
            res.render('rooms/show', {
                room: room,
                errorMessage: 'Could Not Remove Room'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, room, hasError = false) {
    renderFormPage(res, room, 'new', hasError)
}

async function renderEditPage(res, room, hasError = false) {
    renderFormPage(res, room, 'edit', hasError)
}

async function renderFormPage(res, room, form, hasError = false) {
    try {
        const params = {
            room: room
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Room'
            } else {
                params.errorMessage = 'Error Creating Room'
            }
        }
        res.render(`rooms/${form}`, params)
    } catch {
        res.redirect('/rooms')
    }
}

function saveCover(room, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        room.coverImage = new Buffer.from(cover.data, 'base64')
        room.coverImageType = cover.type
    }
}

module.exports = router