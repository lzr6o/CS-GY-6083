const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const Author = require('../models/author')
const Event = require('../models/event')
const Book = require('../models/book')
const Room = require('../models/room')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// author login route
router.get('/login', (req, res) => {
    res.render('author/login')
})

// author login route
router.post('/login', async (req, res) => {
    var username = req.body.username
    var password = req.body.password
    const author = await Author.findOne({ username: username, password: password })
    if (!author) {
        res.render('author/login', { errorMessage: 'Error Login in' })
    }
    else {
        res.render('author', { author: author })
    }
})

// author register route
router.get('/register', async (req, res) => {
    res.render('author/register', { author: new Author() })
})

// create author route
router.post('/register', async (req, res) => {
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
        res.redirect(`/author/${newAuthor.id}`)
    } catch {
        res.render('author/register', {
            author: author,
            errorMessage: 'Error Register Author'
        })
    }
})

// show author route
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('author/show', { author: author })
    } catch {
        res.redirect('/')
    }
})

// edit author route
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('author/edit', { author: author })
    } catch {
        res.redirect('/author')
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
        res.redirect(`author/${author.id}`)
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('author/edit', {
                author: author,
                errorMessage: 'Error Updating Author'
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
        res.redirect('/author')
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.redirect(`/author/${author.id}`)
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