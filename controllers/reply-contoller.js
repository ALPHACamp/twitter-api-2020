const { User, Tweet, Reply } = require('../models')

const helpers = require('../_helpers')

const replyController = {
    postReply: (req, res, next) => {
        const { tweet_id } = req.params
        const comment = req.body?.comment?.trim() || null
        const userId = helpers.getUser(req).id
        return Promise.all([
            User.findByPk(userId),
            Tweet.findByPk(tweet_id)
        ])
        .then(([ user, tweet ]) => {
            if (!user) return res.json({ status: 'error', message: "User didn't exist!" })
            if (!tweet) return res.json({ status: 'error', message: "Tweet didn't exist!" })
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
    },

    putReply: async (req, res, next) => {
        const replyId = req.params.reply_id
        const comment = req.body?.comment?.trim() || null

        try {
 
            if (!comment) return res.json({ status: 'error', message: "Comment is required!'" })
            if (comment.length > 140) return res.json({ status: 'error', message: "Comment is too long!'" })

            const reply = await Reply.findByPk(replyId)
            if (!reply) return res.json({ status: 'error', message: "Reply didn't exist!"})
            if (helpers.getUser(req).id !== Number(reply.UserId)) return res.json({ status: 'error', message: "You can't do this." })
   
            return reply.update({ comment })
            .then(() => res.json({ status: 'success' }))
        } catch (err) { next(err) }
    },

    deleteReply: async (req, res, next) => {
        const replyId = req.params.reply_id

        try {
            const reply = await Reply.findByPk(replyId)
            console.log(reply.TweetId)
            console.log(tweet.id)
            if (!reply) return res.json({ status: 'error', message: "Reply didn't exist!"})
            if (helpers.getUser(req).id !== Number(reply.UserId)) return res.json({ status: 'error', message: "You can't do this." })


            return reply.destroy()
            .then(() => res.json({ status: 'success' }))
        } catch (err) { next(err) }

    }
}

module.exports = replyController