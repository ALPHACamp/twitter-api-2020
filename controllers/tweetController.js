const db = require('../models')
const Tweet = db.Tweet
const User = db.User
var helpers = require('../_helpers');
// const adminService = require('../services/adminService.js')

let tweetController = {
    getTweets: (req, res, callback) => {
        return Tweet.findAll({
            // where: { UserId: 1 }
            include: [User]
        }).then(tweets => {

            return res.json(tweets)
        }).catch(error => console.error(error))
    },

    getTweet: (req, res, callback) => {
        return Tweet.findByPk(req.params.id, {
            include: [User]
        }).then(tweets => {
            return res.json(tweets)
        }).catch(error => console.error(error))
    },
    postTweet: (req, res, callback) => {
        return Tweet.create({
            description: req.body.description,
            UserId: helpers.getUser(req).id
        })
            .then((category) => {
                return res.status(200).json({ status: 'success', message: 'Tweet was successfully created' })
            })

            .catch(error => console.error(error))
    },
    deleteTweet: (req, res, callback) => {
        return Tweet.findByPk(req.params.id)
            .then(async (tweet) => {
                await tweet.destroy()
                return res.json({ status: 'success', message: 'Tweet was successfully deleted' })
            })
            .catch(error => console.error(error))
    },

}
module.exports = tweetController

