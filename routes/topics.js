const express = require('express')
const router = express.Router()
const Topic = require('../models/topic')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// all topics route
router.get('/', async (req, res) => {
    let query = Topic.find()
    if (req.query.type != null && req.query.type != '') {
        query = query.regex('type', new RegExp(req.query.type, 'i'))
    }
    try {
        const topics = await query.exec()
        res.render('topics/index', {
            topics: topics,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// new topic route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Topic())
})

// create topic route
router.post('/', async (req, res) => {
    const topic = new Topic({
        type: req.body.type,
        description: req.body.description
    })
    saveCover(topic, req.body.cover)
    try {
        const newTopic = await topic.save()
        res.redirect(`topics/${newTopic.id}`)
    } catch {
        renderNewPage(res, topic, true)
    }
})

// show topic route
router.get('/:id', async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id)
        res.render('topics/show', { topic: topic })
    } catch {
        res.redirect('/')
    }
})

// edit topic route
router.get('/:id/edit', async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id)
        renderEditPage(res, topic)
    } catch {
        res.redirect('/')
    }
})

// update topic route
router.put('/:id', async (req, res) => {
    let topic
    try {
        topic = await Topic.findById(req.params.id)
        topic.type = req.body.type
        topic.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(topic, req.body.cover)
        }
        await topic.save()
        res.redirect(`/topics/${topic.id}`)
    } catch {
        if (topic != null) {
            renderEditPage(res, topic, true)
        } else {
            res.redirect('/')
        }
    }
})

// delete topic route
router.delete('/:id', async (req, res) => {
    let topic
    try {
        topic = await Topic.findById(req.params.id)
        await topic.remove()
        res.redirect('/topics')
    } catch {
        if (topic != null) {
            res.render('topics/show', {
                topic: topic,
                errorMessage: 'Could Not Remove Topic'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, topic, hasError = false) {
    renderFormPage(res, topic, 'new', hasError)
}

async function renderEditPage(res, topic, hasError = false) {
    renderFormPage(res, topic, 'edit', hasError)
}

async function renderFormPage(res, topic, form, hasError = false) {
    try {
        const params = {
            topic: topic
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Topic'
            } else {
                params.errorMessage = 'Error Creating Topic'
            }
        }
        res.render(`topics/${form}`, params)
    } catch {
        res.redirect('/topics')
    }
}

function saveCover(topic, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        topic.coverImage = new Buffer.from(cover.data, 'base64')
        topic.coverImageType = cover.type
    }
}

module.exports = router