const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers.js')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const likeController = {
    addLike: (req, res) => {
        Like.create({
            UserId: helpers.getUser(req).id,
            TweetId: req.params.id
        }).then((like) => {
            return res.json(like)
        })
    }
}
module.exports = likeController