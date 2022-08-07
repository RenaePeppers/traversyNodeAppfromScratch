const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')

// description Login/Landing page
//@route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', 
        {layout: 'login',
    })
})


// description Dashboard
//@route GET /dashboard
router.get('/dashboard', ensureAuth, (req, res) => {
    console.log(req.User)
    res.render('dashboard')
})

module.exports=router