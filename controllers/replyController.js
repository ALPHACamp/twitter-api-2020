const helpers = require('../_helpers')
const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User

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
    postReply: (req, res) => {
        if (Number(req.params.id) !== helpers.getUser(req).id) {
            return res.json({ status: 'error', message: 'permission denied'})
        }
        if (req.body.comment.trim().length === 0 || req.body.comment.length < 1) {
            return res.json({ status: 'error', message: 'Comment cannot be blank.' })
        }
        Reply.create({
            comment: req.body.comment,
            TweetId: req.params.tweet_id,
            UserId: helpers.getUser(req).id
        })
            .then((tweet) => {
                return res.json(tweet)
            }).catch(err => console.log(err))
    }
}
module.exports = replyController