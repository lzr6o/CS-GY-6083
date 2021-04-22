const express = require('express')
const router = express.Router()
const Copy = require('../models/copy')
const Book = require('../models/book')

// all copies route
router.get('/', async (req, res) => {
    let query = Copy.find()
    if (req.query.status != null && req.query.status != '') {
        query = query.regex('status', new RegExp(req.query.status, 'i'))
    }
    try {
        const copies = await query.exec()
        res.render('copies/index', {
            copies: copies,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new copy route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Copy())
})

// create copy route
router.post('/', async (req, res) => {
    const copy = new Copy({
        description: req.body.description,
        status: req.body.status,
        book: req.body.book
    })
    try {
        const newCopy = await copy.save()
        res.redirect(`copies/${newCopy.id}`)
    } catch {
        renderNewPage(res, copy, true)
    }
})

// show copy route
router.get('/:id', async (req, res) => {
    try {
        const copy = await Copy.findById(req.params.id)
            .populate('book')
            .exec()
            res.render('copies/show', { copy : copy })
    } catch {
        res.redirect('/')
    }
})

// edit copy route
router.get('/:id/edit', async (req, res) => {
    try {
        const copy = await Copy.findById(req.params.id)
        renderEditPage(res, copy)
    } catch {
        res.redirect('/')
    }
})

// update copy route
router.put('/:id', async (req, res) => {
    let copy
    try {
        copy = await Copy.findById(req.params.id)
        copy.description = req.body.description
        copy.status = req.body.status
        copy.book = req.body.book
        await copy.save()
        res.redirect(`/copies/${copy.id}`)
    } catch {
        if (copy != null) {
            renderEditPage(res, copy, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete copy route
router.delete('/:id', async (req, res) => {
    let copy
    try {
        copy = await Copy.findById(req.params.id)
        await copy.remove()
        res.redirect('/copies')
    } catch {
        if (copy != null) {
            res.render('copies/show', {
                copy: copy,
                errorMessage: 'Could Not Remove Copy'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, copy, hasError = false) {
    renderFormPage(res, copy, 'new', hasError)
}

async function renderEditPage(res, copy, hasError = false) {
    renderFormPage(res, copy, 'edit', hasError)
}

async function renderFormPage(res, copy, form, hasError = false) {
    try {
        const books = await Book.find({})
        const params = {
            books: books,
            copy: copy
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Copy'
            } else {
                params.errorMessage = 'Error Creating Copy'
            }
        }
        res.render(`copies/${form}`, params)
    } catch {
        res.redirect('/copies')
    }
}

module.exports = router