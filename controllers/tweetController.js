const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
    getTweets: (req, res) => {
        Tweet.findAll({
            raw: true,
            nest: true,
            include: [User, Reply, Like],
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
    }


}

module.exports = tweetController