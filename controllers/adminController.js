const db = require('../models')
const { User, Tweet, Like } = db


const adminController = {
  getUsers: async (req, res) => {
    try {
      let users = await User.findAll({
        include: [
          { model: Tweet, include: [Like] },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }]
      })
      users = users.map(user => {
        let likedCount = 0
        user.Tweets.forEach(tweet => {
          likedCount += tweet.Likes.length
        })
        return {
          id: user.id,
          account: user.account,
          name: user.name,
          avatar: user.avatar,
          cover: user.cover,
          tweetCount: user.Tweets.length,
          likedCount,
          followingCount: user.Followings.length,
          followerCount: user.Followers.length
        }
      })
      users.sort((a, b) => b.tweetCount - a.tweetCount)
      return res.status(200).json(users)
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  deleteTweet: async (req, res) => {
    try {
      const id = req.params.id
      const tweet = await Tweet.findByPk(id)
      if (!tweet) { return res.status(401).json({ status: 'error', message: 'this tweet doesn\'t exist!' }) }
      await tweet.destroy()
      return res.status(200).json({ status: 'success', message: 'this tweet has been deleted!' })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  }
}

module.exports = adminController
