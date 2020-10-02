const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')

let replyController = {
    getReplies: (req, res) => {
        return Tweet.findByPk(req.params.tweet_id, {
            order: [[{ model: Reply }, 'createdAt', 'DESC']],
            include: [
                { model: Reply, include: [User] },
            ]
        }).then(tweet => {
            const data = tweet.Replies.map(r => ({
                ...r.dataValues,
                comment: r.comment
            }))
            return res.json(data)
        }).catch(err => console.log(err))
    },
}
module.exports = replyController