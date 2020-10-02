const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers.js')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like

const likeController = {
    addLike: (req, res) => {
        Like.create({
            UserId: helpers.getUser(req).id,
            TweetId: req.params.id
        }).then((like) => {
            return res.json({ status: 'success', message: '' })
        }).catch(err => console.log(err))
    },
    removeLike: (req, res) => {
        return Like.findOne({
            where: {
                UserId: helpers.getUser(req).id,
                TweetId: req.params.id
            }
        }).then((like) => {
            like.destroy()
                .then((like) => {
                    return res.json({ status: 'success', message: '' })
                })
        }).catch(err => console.log(err))
    }
}
module.exports = likeController