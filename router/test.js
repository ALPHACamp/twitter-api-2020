const router = require('express').Router()
router.get('/', (req, res) => {
  console.log('GET:test: req.query', req?.query)
  console.log('GET:test: req.params', req?.params)
  res.json({
    status: 'seccess',
    message: 'get data'
  })
})
router.post('/', (req, res) => {
  console.log('POST:test req.body', req.body)
  console.log('POST:test: req.query', req?.query)
  console.log('POST:test: req.params', req?.params)
  res.json({
    status: 'seccess',
    message: 'get data'
  })
})

module.exports = router
