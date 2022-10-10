const router = require('express').Router()
const multer = require('multer')
const upload = multer()

router.get('/', (req, res) => {
  console.log('GET:test: req.query', req?.query)
  console.log('GET:test: req.params', req?.params)
  console.log('POST:test req.body', req.body)
  res.json({
    status: 'seccess',
    message: 'get data'
  })
})
router.post('/', (req, res) => {
  console.log('POST:test: req.query', req?.query)
  console.log('POST:test: req.params', req?.params)
  console.log('POST:test req.body', req.body)
  res.json({
    status: 'seccess',
    message: 'get data'
  })
})
router.put(
  '/picture',
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]),
  (req, res) => {
    console.log('POST:test req.files', req.files)
    console.log('POST:test: req.query', req?.query)
    console.log('POST:test: req.params', req?.params)
    console.log('POST:test req.body', req.body)
    res.json({
      status: 'seccess',
      message: 'get data'
    })
  }
)

module.exports = router
