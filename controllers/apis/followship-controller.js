const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
const helpers = require('../../_helpers')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../../models')
const { Op } = require("sequelize");

const followshipController = {
    addFollowing: (req, res, next) => {
        const followingId = req.body.id
        const followerId = helpers.getUser(req).id
        Promise.all([
            User.findByPk(followerId),
            Followship.findOne({
                where: { followingId, followerId }
            })
        ])
            .then(([user, followship]) => {
                if (!user) {
                    throw new Error('user not found')
                }
                if (followship) {
                    throw new Error('had followed')
                }
                if (user.id === Number(followingId)) {
                    throw new Error('no follow yourself')
                }
                return Followship.create({
                    followingId,
                    followerId
                })
            })
            .then((response) => {
                response = response.toJSON()
                res.json({
                    status: 'success',
                    data: response
                })
            })
            .catch(err => next(err))
    },
    removeFollowing: (req, res, next) => {
        const followingId = req.params.followingId
        const followerId = helpers.getUser(req).id
        return Followship.findOne({
            where: {
                followingId: followingId,
                followerId: followerId
            }
        })
            .then(followship => {
                if (!followship) throw new Error('you are not following')
                return followship.destroy()
            })
            .then((response) => {
                response = response.toJSON()
                res.json({
                    status: 'success',
                    data: response
                })
            })
            .catch(err => next(err))
    },
    getFollowersTop: (req, res, next) => {
        Promise.all([
            User.findAll(),
            Followship.findAll()
        ]).then(([users, followships]) => {

            for (let i = 0; i < users.length; i++) {
                users[i].dataValues.count = 0
                for (let j = 0; j < followships.length; j++) {
                    if (users[i].dataValues.id == followships[j].followingId) {
                        users[i].dataValues.count += 1
                    }
                }
            }
            users.sort((a, b) => b.dataValues.count - a.dataValues.count)

            res.json(
                users
            )
        })
    }
}
module.exports = followshipController