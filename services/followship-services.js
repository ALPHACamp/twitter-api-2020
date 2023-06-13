const {
    Followship, User
} = require('../models')
const helpers = require('../_helpers')

const followshipServices = {
    addFollowing: (req, cb) => {
        const followingId = req.body.id
        const followerId = helpers.getUser(req).id
        if (followingId === followerId) throw new Error('你不能追蹤自己！')

        Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
            where: {
                followerId,
                followingId
            }
        })])
            .then(([user, isFollowing]) => {
            if (!user) throw new Error("該名使用者不存在!")
            if (isFollowing) throw new Error('你已經追蹤過這名使用者了！')
            return Followship.create({
                followerId,
                followingId
            })
                .then(followship => {
                const Newfollowship = followship.dataValues.followingId
                cb(null, {
                    status: '追蹤成功！',
                    ...followship.toJSON(),
                    isFollowed: (Newfollowship === followingId)
                })
            })
                .catch (err => cb(err))
        })
            .catch (err => cb(err))
    },
    removeFollowing: async(req, cb) => {
        try {
            const followingId = req.params.id
            const followerId = helpers.getUser(req).id
            const followship = await Followship.findOne({
                where: {
                    followerId,
                    followingId
                }
            })
            const user = await User.findByPk(followingId)
            if (!user) throw new Error("該名使用者不存在")
            if (!followship) throw new Error("你尚未追蹤此人！")
            const deletedFollowship = await followship.destroy()
            cb(null, {
                status: '取消追蹤！',
                ...deletedFollowship.toJSON(),
                isFollowed: (deletedFollowship.dataValues.followingId === followingId)
            })
        } catch (err) {
            cb(err)
        }
    }
}

module.exports = followshipServices