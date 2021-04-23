const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', async (req, res) => {
    res.render('login')
})

//const initializePassport = require('./passport-config')
//initializePassport(
//  passport,
//  username => users.find(user => user.username === username),
//  id => users.find(user => user.id === id)
//)



module.exports = router