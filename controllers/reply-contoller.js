const { User, Tweet, Reply } = require('../models')

const helpers = require('../_helpers')

const replyController = {
    postReply: (req, res, next) => {
        const { tweet_id } = req.params
        const { comment } = req.body
        const userId = helpers.getUser(req).id
        return Promise.all([
            User.findByPk(userId),
            Tweet.findByPk(tweet_id)
        ])
        .then(([ user, tweet ]) => {
            if (!user) return res.json({ status: 'error', message: "User didn't exist!'" })
            if (!tweet) return res.json({ status: 'error', message: "Tweet didn't exist!'" })
            if (!comment) return res.json({ status: 'error', message: "Comment is required!'" })
            if (comment.length > 140) return res.json({ status: 'error', message: "Comment is too long!'" })
            return Reply.create({
                comment,
                TweetId: tweet_id,
                UserId: userId
            })
            .then(() => {
               return res.json({ status: 'success'})
            })
            .catch(err => next(err))
        })
    }
}

module.exports = replyController