const express = require('express')
const router = express.Router()

/* TODO: 測試/api/admin 路由可運作使用，可把下面路由刪除 */
router.get('/', (req, res) => res.send('Hello admin'))

module.exports = router