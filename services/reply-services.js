const { User, Tweet, Reply } = require('../models')

const replyServices = {
    getReplies: (req, cb) => {
        const { TweetId } = req.params
        Reply.findAll({
            where: { TweetId },
            raw: true,
            nest: true,
            order: [['createdAt', 'DESC']],
        })
            .then(replies => cb(null, { replies }))
            .catch(err => cb(err))
    },
    postReply: (req, cb) => {
        const { TweetId } = req.params
        // 因應登入機制相關問題，暫時使用固定的UserId
        const UserId = 3
        const { comment } = req.body
        Promise.all([
            Tweet.findByPk(TweetId),
            User.findByPk(UserId)
        ]).then(([tweet, user]) => {
            if (!tweet) {
                const err = new Error('推文不存在！')
                err.status = 404
                throw err
            }
            if (!user) {
                const err = new Error('用戶不存在！')
                err.status = 404
                throw err
            }
            if (!comment) {
                const err = new Error('內容不可空白')
                err.status = 404
                throw err
            }
            return Reply.create({ comment, UserId, TweetId })
        })
            .then(newReply => cb(null, { reply: newReply }))
            .catch(err => cb(err))
    }
}

module.exports = replyServices