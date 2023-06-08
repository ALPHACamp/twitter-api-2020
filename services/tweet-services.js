const { Tweet, User, Like, Reply } = require('../models')

const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

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
      const { id } = req.params
        return Promise.all([
        Tweet.findByPk(req.params.id, {
          include: [
            User, 
          ],
          nest: true,
          raw: true
          }),
            Like.count({
                where: {
                    TweetId: id
                }
            }),
            Reply.count({
                where: {
                    TweetId: id
                }
            })
        ])
            .then(([tweet, likes, replies]) => {
                if (!tweet) throw new Error("Tweet didn't exist!")
                cb(null, {
                    tweet,
                    likeCount: likes,
                    replyCount: replies,
                    createdAt: dayjs().to(tweet.createdAt)
                })
            })
            .catch(err => cb(err))
    }
}

module.exports = tweetServices