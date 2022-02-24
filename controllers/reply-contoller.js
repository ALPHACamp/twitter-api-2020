const { User, Tweet, Reply } = require('../models')

const replyController = {
    postReply: (req, res, next) => {
        const { tweet_id } = req.params
        const { comment } = req.body
        const userId = req.user.id
        console.log(`tweet_id=${tweet_id}，comment=${comment}，userId=${userId}`)
        return Promise.all([
            User.findByPk(userId),
            Tweet.findByPk(tweet_id)
        ])
        .then(([ user, tweet ]) => {
            if (!user) return res.json({ status: 'error', message: "User didn't exist!'" })
            if (!tweet) return res.json({ status: 'error', message: "Tweet didn't exist!'" })
            return Reply.create({
                comment,
                tweetId: tweet_id,
                userId
            })
            .then(() => {
               return res.json({ status: 'success'})
            })
        })
    }
}

module.exports = replyController