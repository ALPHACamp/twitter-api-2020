const db = require('../../models')

const { User, Tweet, Reply, Like } = db
const login = require('../../utils/login')

const adminController = {
  getUsers: async (req, res) => {
    /*  #swagger.tags = ['Admin']
        #swagger.description = 'admin 瀏覽所有使用者，依照推文數排序'
        #swagger.responses[200] = {
          description: '回傳陣列帶有多個user物件',
          schema: [{"$ref": "#/definitions/GeneralUser"}]
        }
        #swagger.responses[400] = {
          description: '找不到users回傳error物件',
          schema: { status: 'error', message: '無法取得用戶資料' }
        }
    */
    try {
      const users = await User.findAll({
        include: [
          Reply, Like, Tweet,
          { model: User, as: 'Followers', attributes: { exclude: ['password'] } },
          { model: User, as: 'Followings', attributes: { exclude: ['password'] } }
        ],
        attributes: {
          exclude: ['password']
        },
        order: [['createdAt', 'DESC']]

      })
      if (!users || !Array.isArray(users)) {
        return res.status(400).json({ status: 'error', message: '無法取得用戶資料' })
      }
      users.sort((a, b) => b.Tweets.length - a.Tweets.length)

      return res.status(200).json(users)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },
  getTweets: async (req, res) => {
    /* #swagger.tags = ['Admin']
        #swagger.description = '瀏覽全部tweets'
        #swagger.responses[200] = {
          description: '回傳陣列帶有多個tweet物件',
          schema: [{"$ref": "#/definitions/Tweet"}]
        }
        #swagger.responses[400] = {
          description: '如果找不到資料回傳error物件',
          schema: { status: 'error', message: 'cannot find any tweet' }
        }
    */
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: Reply, include: { model: User, attributes: { exclude: ['password'] } } },
          Like,
          { model: User, attributes: { exclude: ['password'] } }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets || !Array.isArray(tweets)) {
        return res.status(400).json({ status: 'error', message: 'cannot find any tweet' })
      }

      return res.status(200).json(tweets)
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },
  removeTweet: async (req, res) => {
    /*
      #swagger.tags = ['Admin']
      #swagger.description = 'admin 刪除單一tweet'
      #swagger.parameters['id'] = {description: "tweet id"}
      #swagger.responses[200] = {
          description: '回傳success物件',
          schema: {"$ref": "#/definitions/SuccessMessage"}
        }
      #swagger.responses[400] = {
        description: '如果找不到tweet回傳error物件',
        schema: { status: 'error', message: 'tweet id does not exist' }
      }
    */
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.status(400).json({ status: 'error', message: 'tweet id does not exist' })
      }

      // remove tweet
      await tweet.destroy()

      return res.status(200).json({ status: 'success', message: 'Success' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },

  login: async (req, res) => {
  /* #swagger.tags = ['Admin']
    #swagger.description = '管理員登入'
    #swagger.parameters['description'] = {
          in: 'body',
          type: "object",
          description: "admin login data",
          schema: {
            account: 'root',
            password: '123456',
          },
          required: true
    }
      #swagger.responses[200] = {
        description: '回傳success物件, toekn 以及user資料',
        schema: {
          "status": "success",
          "message": "成功登入!!!",
          "token": "yourToken...",
          "user": {
            "id": 1,
            "name": "root",
            "email": "root@example.com",
            "role": "admin"
          }
        }
      }
    #swagger.responses[400] = {
      description: '所有欄位必填, 帳號必須存在, 否則回傳error物件',
      schema: { status: 'error', message: '所有欄位都是必填的!!!' }
    }
  */
    await login(req, res, 'admin')
  }
}

module.exports = adminController
