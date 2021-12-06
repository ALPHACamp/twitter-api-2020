const helpers = require('../_helpers')

const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
    getTweets: (req, res) => {
        Tweet.findAll({
            include: [
                User,
                Like,
                { model: Reply, include: [User] }
            ]
        }).then(tweets => {
            tweets.map(tweet => ({
                id: tweet.id,
                UserId: tweet.UserId,
                description: tweet.description,
                createdAt: tweet.createdAt,
                updatedAt: tweet.updatedAt,
                isLiked: tweet.Likes.map(d => d.UserId).includes(helpers.getUser(req).id)
            }))
            return res.json(tweets)
        })
    },

    getTweet: (req, res) => {
        return Tweet.findByPk(req.params.tweet_id, {
            include: [User, Like, { model: Reply, include: [User] }]
        }).then(tweet => {
            return res.json(tweet)
        })
    },

    postTweet: (req, res) => {
        if (req.body.description.length > 140) {
            return res.json({ status: 'error', message: '字數最多 140 字' })
        }
        if (!req.body.description) {
            return res.json({ status: 'error', message: '內容不可空白' })
        } else {
            return Tweet.create({
                UserId: helpers.getUser(req).id,
                description: req.body.description
            })
                .then((tweet) => {
                    res.json({ status: 'success', message: '成功新增推文' })
                })
                .catch(error => console.log('error'))
        }
    }
}
module.exports = tweetController