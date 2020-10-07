const helpers = require('../_helpers.js')
const db = require('../models')
const Like = db.Like

const likeController = {
    addLike: (req, res) => {
        if (Number(req.params.id) !== helpers.getUser(req).id) {
            return res.json({ status: 'error', message: 'permission denied'})
        }
        Like.create({
            UserId: helpers.getUser(req).id,
            TweetId: req.params.id
        }).then((like) => {
            return res.json({ status: 'success', message: '' })
        }).catch(err => console.log(err))
    },
    removeLike: (req, res) => {
        if (Number(req.params.id) !== helpers.getUser(req).id) {
            return res.json({ status: 'error', message: 'permission denied'})
        }
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