const helpers = require('../_helpers.js')
const db = require('../models')
const Like = db.Like

const likeController = {
    addLike: (req, res) => {
        Like.create({
            UserId: helpers.getUser(req).id,
            TweetId: req.params.id
        }).then((like) => {
            return res.json({ status: 'success', message: '' })
        }).catch(err => console.log(err))
    },
    removeLike: (req, res) => {
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