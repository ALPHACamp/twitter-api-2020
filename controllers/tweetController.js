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
            include: [{ model: User, as: 'LikedUsers' }, Reply ],
            order: [['createdAt', 'DESC']]
        }).then(tweet => {
            const tweetArray = tweet.map(t => ({
                ...t.dataValues,
                description: t.dataValues.description.substring(0, 50)
            }))
            res.json(tweetArray)
        })
    }
}
module.exports = tweetController