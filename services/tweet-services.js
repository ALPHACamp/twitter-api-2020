const { Tweet, User } = require('../models')
const tweetServices = {
  getTweets: async(req, cb) => {
      try{
        const tweets = await Tweet.findAll({
          include: User,
          nest: true,
          raw: true
          })
        const data =Array.from(tweets)
          return cb(null,data)
      } catch (err) {
            cb(err)
        }
    },
    getTweet: async(req, cb) => {
      try{
        const tweet = await Tweet.findByPk(req.params.id, {
          include: [
            User, 
            //{ model: User, as: 'LikedUsers' },
            // { model: Replies, include: User },
          ],
          nest: true,
          raw: true
          })
        //const likeCount = tweet.LikedUsers.length
        // const replyCount = tweet.User.length
        if (!tweet) throw new Error("Tweet didn't exist!")
        return cb(null,{
            tweet,
            //likeCount,
            // replyCount
        })
      } catch (err) {
            cb(err)
      }
    }
}

module.exports = tweetServices