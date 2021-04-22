const express = require('express')
const router = express.Router()
const Invitation = require('../models/invitation')
const Author = require('../models/author')
const Event = require('../models/event')

// all invitations route
router.get('/', async (req, res) => {
    let query = Invitation.find()
    if (req.query.id != null && req.query.id != '') {
        query = query.regex('id', new RegExp(req.query.id, 'i'))
    }
    try {
        const invitations = await query.exec()
        res.render('invitations/index', {
            invitations: invitations,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new invitation route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Invitation())
})

// create invitation route
router.post('/', async (req, res) => {
    const invitation = new Invitation({
        author: req.body.author,
        event: req.body.event
    })
    try {
        const newInvitation = await invitation.save()
        res.redirect(`invitations/${newInvitation.id}`)
    } catch {
        renderNewPage(res, invitation, true)
    }
})

// show invitation route
router.get('/:id', async (req, res) => {
    try {
        const invitation = await Invitation.findById(req.params.id)
            .populate('author')
            .populate('event')
            .exec()
        res.render('invitations/show', { invitation : invitation })
    } catch {
        res.redirect('/')
    }
})

// edit invitation route
router.get('/:id/edit', async (req, res) => {
    try {
        const invitation = await Invitation.findById(req.params.id)
        renderEditPage(res, invitation)
    } catch {
        res.redirect('/')
    }
})

// update invitation route
router.put('/:id', async (req, res) => {
    let invitation
    try {
        invitation = await Invitation.findById(req.params.id)
        invitation.author = req.body.author
        invitation.event = req.body.event
        await invitation.save()
        res.redirect(`/invitations/${invitation.id}`)
    } catch {
        if (invitation != null) {
            renderEditPage(res, invitation, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete invitation route
router.delete('/:id', async (req, res) => {
    let invitation
    try {
        invitation = await Invitation.findById(req.params.id)
        await invitation.remove()
        res.redirect('/invitations')
    } catch {
        if (invitation != null) {
            res.render('invitations/show', {
                invitation: invitation,
                errorMessage: 'Could Not Remove Invitation'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, invitation, hasError = false) {
    renderFormPage(res, invitation, 'new', hasError)
}

async function renderEditPage(res, invitation, hasError = false) {
    renderFormPage(res, invitation, 'edit', hasError)
}

async function renderFormPage(res, invitation, form, hasError = false) {
    try {
        const authors = await Author.find({})
        const events = await Event.find({})
        const params = {
            authors: authors,
            events: events,
            invitation: invitation
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Invitation'
            } else {
                params.errorMessage = 'Error Creating Invitation'
            }
        }
        res.render(`invitations/${form}`, params)
    } catch {
        res.redirect('/invitations')
    }
}

module.exports = router