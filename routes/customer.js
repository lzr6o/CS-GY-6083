const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const Author = require('../models/author')
const Event = require('../models/event')
const Book = require('../models/book')
const Room = require('../models/room')

// index route
router.get('/', async (req, res) => {
    let authors, events, books, rooms
    try {
        authors = await Author.find().sort({ createdAt: 'desc' }).limit(10).exec()
        events = await Event.find().sort({ createdAt: 'desc' }).limit(10).exec()
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
        rooms = await Room.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        authors = []
        events = []
        books = []
        rooms = []
    }
    res.render('customer/index', {
        authors: authors,
        events: events,
        books: books,
        rooms: rooms
    })
})

// profile route


// register route 


// rental route


// reserve route


module.exports = router