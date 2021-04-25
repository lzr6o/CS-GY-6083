const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// all authors route
router.get('/', async (req, res) => {
    let query = Author.find()
    if (req.query.name != null && req.query.name !== '') {
        query = query.regex('fullName', new RegExp(req.query.name, 'i'))
    }
    try {
        const authors = await query.exec()
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// author login route
router.get('/login', (req, res) => {
    res.redirect('/login')
})

// new author route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// create author route
router.post('/', async (req, res) => {
    const author = new Author({
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.firstName + ' ' + req.body.lastName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        email: req.body.email,
        phone: req.body.phone,
        street: req.body.street,
        city: req.body.city,
        zipcode: req.body.zipcode,
        state: req.body.state,
        country: req.body.country
    })
    saveCover(author, req.body.cover)
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error Creating Author'
        })
    }
})

// show author route
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
})

// edit author route
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch {
        res.redirect('/authors')
    }
})

// update author route
router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.username = req.body.username
        author.password = req.body.password
        author.fullName = req.body.firstName + ' ' + req.body.lastName
        author.firstName = req.body.firstName
        author.lastName = req.body.lastName
        author.gender = req.body.gender
        author.email = req.body.email
        author.phone = req.body.phone
        author.street = req.body.street
        author.city = req.body.city
        author.zipcode = req.body.zipcode
        author.state = req.body.state
        author.country = req.body.country
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(author, req.body.cover)
        }
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

// delete author route
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

function saveCover(author, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        author.coverImage = new Buffer.from(cover.data, 'base64')
        author.coverImageType = cover.type
    }
}

module.exports = router