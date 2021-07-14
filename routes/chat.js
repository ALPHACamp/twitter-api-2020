const express = require('express')
const router = express.Router()
const path = require('path')
const filePath = './index.html'
const resolvedPath = path.resolve(filePath)

router.get('/', (req, res) => {
  res.sendFile(resolvedPath)
})

module.exports = router