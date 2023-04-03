const { tryCatch } = require('../helpers/tryCatch')
const { ReqError } = require('../helpers/errorInstance')
const { User, Followship } = require('../models')
const { getUser } = require('../_helpers')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const adminController = {
  postFollowship: tryCatch(async (req, res) => {
    const followingId = Number(req.body.id) || null
    const followerId = getUser(req).dataValues.id
    if (followingId === followerId) throw new ReqError('無法追蹤自己!')
    const [isFollowed, user] = await Promise.all([
      Followship.findOne({ where: { followingId, followerId } }), // 檢查是否追蹤過
      User.findByPk(followingId)// 檢查欲追蹤使用者是否存在
    ])
    if (isFollowed) throw new ReqError('已追蹤此使用者!')
    if (!user) throw new ReqError('使用者不存在!')
    const followship = await Followship.create({
      followerId,
      followingId
    })
    res.status(200).json(followship.toJSON())
  }),
  getFollowship: tryCatch(async (req, res) => {
    const { limit, sort } = req.query
    const currentUser = getUser(req)
    const users = await User.findAll({ // chatGDP大哥教的
      subQuery: false,
      where: {
        role: {
          [Op.not]: 'admin'
        }
      },
      attributes: [
        'id', 'account', 'name', 'avatar',
        [sequelize.fn('COUNT', sequelize.col('Followers.id')), 'followersCount']
      ],
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: [],
          through: { attributes: [] }
        }
      ],
      group: ['User.id'],
      limit: Number(limit) || null,
      order: sort ? [[sequelize.literal('followersCount'), 'DESC']] : null,
      raw: true
    })
    const result = users.map(user => {
      return {
        ...user,
        currentfollowed: currentUser.Followings.some(fu => fu.id === user.id) // fu = following user
      }
    })
    res.status(200).json(result)
  }),
  deleteFollowship: tryCatch(async (req, res) => {
    const followerId = getUser(req).dataValues.id
    const followingId = req.params.followingId
    const [followship, user] = await Promise.all([
      Followship.findOne({ where: { followingId, followerId } }), // 檢查是否追蹤過
      User.findByPk(followingId)// 檢查欲追蹤使用者是否存在
    ])
    if (!followship) throw new ReqError('資料庫無此筆資料')
    if (!user) throw new ReqError('使用者不存在!')
    const deletedFollowship = await followship.destroy()
    res.status(200).json(deletedFollowship.toJSON())
  })
}

module.exports = adminController
