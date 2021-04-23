const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.render('author/index')
})

module.exports = router