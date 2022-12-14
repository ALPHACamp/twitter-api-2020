const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/users', adminController.getUsers)

// router.use('/', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
