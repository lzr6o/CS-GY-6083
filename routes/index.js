const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const Author = require('../models/author')
const Event = require('../models/event')
const Book = require('../models/book')
const Room = require('../models/room')
const Topic = require('../models/topic')
const Sponsor = require('../models/sponsor')

router.get('/', async (req, res) => {
    let customers, authors, events, books, rooms, topics, sponsors
    try {
        customers = await Customer.find().sort({ createdAt: 'desc' }).limit(10).exec()
        authors = await Author.find().sort({ createdAt: 'desc' }).limit(10).exec()
        events = await Event.find().sort({ createdAt: 'desc' }).limit(10).exec()
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
        rooms = await Room.find().sort({ createdAt: 'desc' }).limit(10).exec()
        topics = await Topic.find().sort({ createdAt: 'desc' }).limit(10).exec()
        sponsors = await Sponsor.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        customers = []
        authors = []
        events = []
        books = []
        rooms = []
        topics = []
        sponsors = []
    }
    res.render('index', {
        customers: customers,
        authors: authors,
        events: events,
        books: books,
        rooms: rooms,
        topics: topics,
        sponsors: sponsors
    })
})

module.exports = router