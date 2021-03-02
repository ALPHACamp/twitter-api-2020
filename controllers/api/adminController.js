const db = require('../../models')

const { User, Tweet, Reply } = db

// @todo - add error handling

const adminController = {
  getUsers: async (req, res) => {
    /*  #swagger.tags = ['Admin']
        #swagger.description = 'admin 瀏覽所有使用者'
        #swagger.responses[200] = {
          description: '回傳陣列帶有多個user物件',
          schema: [{"$ref": "#/definitions/GeneralUser"}]
        }
    */
    try {
      const users = await User.findAll()
      return res.status(200).json(users)
    } catch (err) {
      return res.status(500).json(err)
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
      // remove replies of the tweet
      await Reply.destroy({
        where: { TweetId: req.params.id }
      })
      // remove tweet
      await tweet.destroy()

      return res.status(200).json({ status: 'success', message: 'Success' })
    } catch (err) {
      return res.status(500).json(err)
    }
  }
}

module.exports = adminController
