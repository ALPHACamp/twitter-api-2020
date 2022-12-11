const { User, Tweet, Reply, Like, Followship } = require('../models')
const { getUser } = require('../_helpers')

const userController = {
  // 瀏覽 Profile：tweetCount, followerCount, followingCount
  getCurrentUser: (req, res, next) => {
    return User.findByPk(getUser(req).id, {
      include: [
        { model: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.json({ currentUser: getUser(req) })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
