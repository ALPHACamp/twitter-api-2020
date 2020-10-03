const helpers = require('../_helpers.js')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply

const tweetController = {
    getTweets: (req, res) => {
        Tweet.findAll({
            include: [User, { model: User, as: 'LikedUsers' }, Reply],
            order: [['createdAt', 'DESC']]
        }).then(tweets => {
            const data = tweets.map(r => ({
                ...r.dataValues,
                description: r.dataValues.description.substring(0, 50),
                isLiked: r.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id),
            }))
            return res.json(data)
        }).catch(err => console.log(err))
    },
    getTweet: (req, res) => {
        return Tweet.findByPk(req.params.id, {
            order: [[{ model: Reply }, 'createdAt', 'DESC']],
            include: [User, Reply, { model: User, as: 'LikedUsers' }]
        }).then(tweet => {
            tweet = { ...tweet.dataValues }
            tweet.isLiked = tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
            return res.json(tweet)
        }).catch(err => console.log(err))
    },
    postTweet: (req, res) => {
        if (req.body.description.trim().length === 0 || req.body.description.length < 1) {
            return res.json({ status: 'error', message: 'Tweet cannot be blank.' })
        }
        if (req.body.description.length > 140) {
            return res.json({ status: 'error', message: ' The word number pleases limit at 140 word including.' })
        }
        Tweet.create({
            description: req.body.description,
            UserId: helpers.getUser(req).id
        }).then((tweet) => {
            return res.json({ status: 'success', message: 'Tweet created successfully.' })
        }).catch(err => console.log(err))
    }
}
module.exports = tweetController