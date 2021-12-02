const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {
    getTweets: (req, res) => {
        Tweet.findAll({
            raw: true,
            nest: true,
            include: User,
            order: [['createdAt', 'DESC']]
        }).then(tweets=>{
            tweets.map(tweet => ({
                id: tweet.id,
                UserId: tweet.UserId,
                description: tweet.description,
                createdAt: tweet.createdAt,
                updatedAt: tweet.updatedAt,
                user: {
                    avatar: tweet.User.avatar,
                    name: tweet.User.name,
                    account: tweet.User.account,
                }
            }))
            return res.json(tweets)
        })
    },
    getTweet:(req,res) =>{
        return Tweet.findByPk(req.params.tweet_id,{
            include: [ User, { model: Reply, include: [User] }]
        }).then(tweet => {
            return res.json(tweet)
        })
    },
    postTweet:(req,res) => {
        if (req.body.description.length > 140) {
            return res.json({ status: 'error', message: 'Tweet can\'t be more than 140 words.' })
        }
        if (!req.body.description) {
            return res.json({status: 'error', message: 'description is empty'})
        } else {
            return Tweet.create({
                UserId: helpers.getUser(req).id,
                description: req.body.description
            })
                .then((tweet) => {
                    res.json({status: 'successful', message: 'The tweet was created'})
                })
                .catch(error => console.log('error'))
        }
    },
    unlikeTweet:(req,res) =>{
        Like.destroy({
            where: {
                UserId: helpers.getUser(req).id,
                TweetId: req.params.id
            }
        })
            .then(() => res.json({ status: 'success', message: 'Like was deleted' }))
    },
    likeTweet: (req, res) => {
        Like.create({UserId: helpers.getUser(req).id, TweetId: req.params.id})
            .then(like => {
                res.json({status: 'success', message: 'The like was successfully created'})
            })
    },
    getTweetReplies: (req, res) => {
        return Reply.findAll({
            where: { TweetId: req.params.tweet_id }
        })
            .then(Replies => {
            return res.json(Replies)
        })
    }
}
module.exports = tweetController