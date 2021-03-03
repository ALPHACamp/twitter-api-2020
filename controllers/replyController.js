const { User, Tweet, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')


const replyController = {

    deleteReply: (req, res) => {
        return Reply.findByPk(req.params.id)
            .then(async (reply) => {

                //不確定前端會不會隱藏刪除按鈕，多加一層驗證讓使用者只能刪掉自己的回復
                if (reply.UserId === helpers.getUser(req).id) {
                    await reply.destroy()
                    return res.json({ status: 'success', message: 'reply was successfully deleted' })
                } else {
                    return res.json({ status: 'fail', message: 'user can not delete this reply' })
                }
            })
            .catch(error => console.error(error))

    },
    putReply: (req, res) => {
        return Reply.findByPk(req.params.id)
            .then(async (reply) => {
                if (reply.UserId === helpers.getUser(req).id) {
                    await reply.update(req.body)
                    return res.json({ status: 'success', message: 'reply was successfully to update', data: req.body })
                } else {
                    return res.json({ status: 'fail', message: 'user can not edit this reply' })
                }

            })
            .catch(error => console.error(error))
    },


}
module.exports = replyController
