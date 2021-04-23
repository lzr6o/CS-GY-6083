const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const Author = require('../models/author')
const Event = require('../models/event')
const Book = require('../models/book')

router.get('/', async (req, res) => {
    let customers, authors, events, books
    try {
        customers = await Customer.find().sort({ createdAt: 'desc' }).limit(10).exec()
        authors = await Author.find().sort({ createdAt: 'desc' }).limit(10).exec()
        events = await Event.find().sort({ createdAt: 'desc' }).limit(10).exec()
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        customers = []
        authors = []
        events = []
        books = []
    }
    res.render('index', {
        customers: customers,
        authors: authors,
        events: events,
        books: books
    })
})

module.exports = router