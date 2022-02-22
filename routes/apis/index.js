const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const admin = require('./modules/admin')

/* TODO: authenticated和authenticatedAdmin部分完成後，增加middleware */
router.use('/admin', admin)


/* TODO: 測試/api路由可運作使用，完成後須把(req, res) => res.send('Hello api')部分刪除 */
router.use('/', apiErrorHandler, (req, res) => res.send('Hello api'))

module.exports = router