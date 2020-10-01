const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers.js')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply

const tweetController = {
    getTweets: (req, res) => {
        Tweet.findAll({
            include: [{ model: User, as: 'LikedUsers' }, Reply],
            order: [['createdAt', 'DESC']]
        }).then(tweet => {
            const tweetArray = tweet.map(t => ({
                ...t.dataValues,
                description: t.dataValues.description.substring(0, 50)
            }))
            res.json(tweetArray)
        })
    },
    getTweet: (req, res) => {
        Tweet.findByPk(req.params.id, {
            include: [ User, { model: Reply, include: [User] }],
            order: [['createdAt', 'DESC']]
        }).then(tweet => {
            res.json(tweet)
        })
        
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
            UserId: req.user.id
        }).then((tweet) => {
            res.json(tweet)
        })
    }
}
module.exports = tweetController