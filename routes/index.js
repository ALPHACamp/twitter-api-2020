const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const followshipController = require('../controllers/followshipController')
const tweetController = require('../controllers/tweetController')

const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })


const { ImgurClient } = require('imgur');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const multer = require('multer')
// 單一檔案
// let upload = multer()
// 多個檔案
let upload = multer()

const db = require('../models')
const User = db.User

module.exports = (app) => {
  app.get('/api/get_current_user', authenticated, userController.getCurrentUser)

  app.post('/api/users/signin', userController.signIn)
  app.post('/api/users', userController.signUp)
  app.put('/api/users/:id', authenticated, userController.putUser)
  app.get('/api/users/:id/tweets', authenticated, userController.getUserTweets)
  app.get('/api/users/:id/replied_tweets', authenticated, userController.getUserRepliedTweets)
  app.get('/api/users/:id/likes', authenticated, userController.getUserLikes)
  app.get('/api/users/:id/followings', authenticated, userController.getUserFollowings)
  app.get('/api/users/:id/followers', authenticated, userController.getUserFollowers)
  app.get('/api/users/:id', authenticated, userController.getUser)

  app.get('/api/followships/recommended', authenticated, followshipController.getRecommendedFollowings)
  app.post('/api/followships', authenticated, followshipController.postFollowship)
  app.delete('/api/followships/:id', authenticated, followshipController.deleteFollowship)

  app.get('/api/tweets', authenticated, authenticated, tweetController.getTweets)
  app.post('/api/tweets', authenticated, tweetController.postTweet)
  app.post('/api/tweets/:id/like', authenticated, tweetController.likeTweet)
  app.post('/api/tweets/:id/unlike', authenticated, tweetController.unlikeTweet)
  app.get('/api/tweets/:id/replies', authenticated, tweetController.getTweetReplies)
  app.post('/api/tweets/:id/replies', authenticated, tweetController.postTweetReply)
  app.get('/api/tweets/:id', authenticated, tweetController.getTweet)

  app.post('/api/admin/users/signin', adminController.signIn)
  app.get('/api/admin/users', adminController.getUsers)
  app.get('/api/admin/tweets', adminController.getTweet)
  app.delete('/api/admin/tweets/:id', adminController.deleteTweet)


  // 測試用，多個圖片 OK；只傳單一圖片也 OK
  app.post('/api/test', authenticated, upload.array('files', 2), async (req, res) => {
    try {
      // user name、introduction 會在 body 內；avatar、banner 在 files 內
      console.log('req.body:', req.body)
      console.log('req.body:', req.body)
      console.log('req.body:', req.body)
      if (!req.body.name) {
        console.log('req.body.name:', req.body.name)
        return res.json({ status: 'error', message: 'Name 不可為空白' })
      }
      console.log('xxxxx')

      //return res.json({ status: 'success' })
      Promise.all(req.files.map(async (file) => {
        let encode_image = file.buffer.toString('base64')
        const client = new ImgurClient({ clientId: IMGUR_CLIENT_ID })
        const response = await client.upload({
          image: encode_image,
          type: 'base64',
        })
        const result = {
          'originalname': file.originalname,
          'imgurLink': response.data.link
        }
        return result
      }))
        .then((results) => {
          console.log('results', results)
          const name = req.body.name
          const introduction = req.body.introduction
          let avatar = undefined
          let banner = undefined
          results.forEach(result => {
            if (result.originalname === 'avatar') {
              avatar = result.imgurLink
            } else if (result.originalname === 'banner') {
              banner = result.imgurLink
            }
          })
          User.findByPk(req.user.id)
            .then(user => {
              user.update({
                ...user,
                name: name,
                introduction: introduction,
                avatar: avatar,
                banner: banner,
              })
            })
          return res.json({ status: 'success', results: results })
        })
    } catch (error) {
      console.warn(error)
    }
  })
  // // 測試用，多個圖片 OK；只傳單一圖片也 OK
  // app.post('/api/test', authenticated, upload.array('files', 2), async (req, res) => {
  //   try {
  //     // user name、introduction 會在 body 內；avatar、banner 在 files 內
  //     console.log('req.body', req.body)
  //     console.log('req.files', req.files)
  //     console.log('req.user', req.user)

  //     //return res.json({ status: 'success' })
  //     Promise.all(req.files.map(async (file) => {
  //       let encode_image = file.buffer.toString('base64')
  //       const client = new ImgurClient({ clientId: IMGUR_CLIENT_ID })
  //       const response = await client.upload({
  //         image: encode_image,
  //         type: 'base64',
  //       })
  //       return response
  //     }))
  //       .then((results) => {
  //         const likes = []
  //         results.forEach(result => {
  //           likes.push(result.data.link)
  //         })
  //         return res.json({ status: 'success', links: likes })
  //       })
  //   } catch (error) {
  //     console.warn(error)
  //   }
  // })
  // 測試用，單一圖片 OK
  // app.post('/api/test', authenticated, upload.single('file'), async (req, res) => {
  //   try {
  //     // user name、introduction 會在 body 內；banner 在 file 內
  //     console.log('req.body', req.body)
  //     console.log('req.file', req.file)

  //     const encode_image = req.file.buffer.toString('base64')
  //     const client = new ImgurClient({ clientId: IMGUR_CLIENT_ID });
  //     const response = await client.upload({
  //       image: encode_image,
  //       type: 'base64',
  //     })
  //     if (response.status === 200) {
  //       return res.json({ status: 'success', link: response.data.link })
  //     } else {
  //       return res.json({ status: 'error', message: '上傳失敗' })
  //     }
  //   } catch (error) {
  //     console.warn(error)
  //   }
  // })
}