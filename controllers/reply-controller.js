const replyServices = require('../services/reply-services')

const replyController = {
    getReplies: (req, res, next) => {
        replyServices.getReplies(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    postReply: (req, res, next) => {
        replyServices.postReply(req, (err, data) => err ? next(err) : res.json({ status: 'success', message: '您已成功新增留言', data }))
    }
}

module.exports = replyController