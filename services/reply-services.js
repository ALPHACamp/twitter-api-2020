const helpers = require('../_helpers')

const {
    relativeTimeFromNow
} = require('../helpers/dayjs-helpers')
const {
    Reply, User, Tweet
} = require('../models')

const replyServices = {
    getReplies: async(req, cb) => {
        try {
            const {
                id
            } = req.params
            const replies = await Reply.findAll({
                raw: true,
                nest: true,
                where: {
                    TweetId: id
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [{
                    model: User
                }, ],
            })
            const tweet = await Tweet.findByPk(id)
            if (!tweet) throw new Error('推文不存在！')
            const newComment = await replies.map(comment => {
                comment.createdAt = relativeTimeFromNow(comment.createdAt)
                delete comment.User.password
                return comment
            })
            cb(null, newComment)
        } catch (err) {
            cb(err, {
                message: "錯誤訊息"
            })
        }
    },
    postReplies: async(req, cb) => {
        try {
            const {
                id
            } = req.params
            const {
                comment
            } = req.body
            const user = await User.findByPk(helpers.getUser(req).id)
            const tweet = await Tweet.findByPk(id)
            if (!user) throw new Error('查無此人！')
            if (!tweet) throw new Error('推文不存在！')
            if (!comment) throw new Error('回覆不能為空！')
            if (comment.length > 140) throw new Error('回覆留言必須在140字內！')
            const reply = await Reply.create({
                comment,
                TweetId: id,
                UserId: helpers.getUser(req).id
            })
            cb(null, {...reply.dataValues,
                createdAt: relativeTimeFromNow(reply.dataValues.createdAt)
            })
        } catch (err) {
            cb(err, {
                message: "錯誤訊息"
            })
        }
    },
}

module.exports = replyServices