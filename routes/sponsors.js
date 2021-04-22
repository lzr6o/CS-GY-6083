const express = require('express')
const router = express.Router()
const Sponsor = require('../models/sponsor')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// all sponsors route
router.get('/', async (req, res) => {
    let query = Sponsor.find()
    if (req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if (req.query.type != null && req.query.type != '') {
        query = query.regex('type', new RegExp(req.query.type, 'i'))
    }
    try {
        const sponsors = await query.exec()
        res.render('sponsors/index', {
            sponsors: sponsors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new sponsor route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Sponsor())
})

// create sponsor route
router.post('/', async (req, res) => {
    const sponsor = new Sponsor({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        name: req.body.firstName + ' ' + req.body.lastName,
        type: req.body.type
    })
    saveCover(sponsor, req.body.cover)
    try {
        const newSponsor = await sponsor.save()
        res.redirect(`sponsors/${newSponsor.id}`)
    } catch {
        renderNewPage(res, sponsor, true)
    }
})

// show sponsor route
router.get('/:id', async (req, res) => {
    try {
        const sponsor = await Sponsor.findById(req.params.id)
        res.render('sponsors/show', { sponsor: sponsor })
    } catch {
        res.redirect('/')
    }
})

// edit sponsor route
router.get('/:id/edit', async (req, res) => {
    try {
        const sponsor = await Sponsor.findById(req.params.id)
        renderEditPage(res, sponsor)
    } catch {
        res.redirect('/')
    }
})

// update sponsor route
router.put('/:id', async (req, res) => {
    let sponsor
    try {
        sponsor = await Sponsor.findById(req.params.id)
        sponsor.firstName = req.body.firstName
        sponsor.lastName = req.body.lastName
        sponsor.name = req.body.firstName + ' ' + req.body.lastName
        sponsor.type = req.body.type
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(sponsor, req.body.cover)
        }
        await sponsor.save()
        res.redirect(`/sponsors/${sponsor.id}`)
    } catch {
        if (sponsor != null) {
            renderEditPage(res, sponsor, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete sponsor route
router.delete('/:id', async (req, res) => {
    let sponsor
    try {
        sponsor = await Sponsor.findById(req.params.id)
        await sponsor.remove()
        res.redirect('/sponsors')
    } catch {
        if (sponsor != null) {
            res.render('sponsors/show', {
                sponsor: sponsor,
                errorMessage: 'Could Not Remove Sponsor'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, sponsor, hasError = false) {
    renderFormPage(res, sponsor, 'new', hasError)
}

async function renderEditPage(res, sponsor, hasError = false) {
    renderFormPage(res, sponsor, 'edit', hasError)
}

async function renderFormPage(res, sponsor, form, hasError = false) {
    try {
        const params = {
            sponsor: sponsor
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Sponsor'
            } else {
                params.errorMessage = 'Error Creating Sponsor'
            }
        }
        res.render(`sponsors/${form}`, params)
    } catch {
        res.redirect('/sponsors')
    }
}

function saveCover(sponsor, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        sponsor.coverImage = new Buffer.from(cover.data, 'base64')
        sponsor.coverImageType = cover.type
    }
}

module.exports = router