const { User, Tweet, Like, sequelize } = require('../models')
const Sequelize = require('sequelize')

const adminService = {
  getUsers: async () => {
    return await User.findAll({  
      where: { role: 'user' },
      attributes: [
        'id',
        'name',
        [Sequelize.fn('concat', '@', Sequelize.col('users.account')), 'account'],
        'avatar',
        'cover',
        [Sequelize.fn('count', Sequelize.col('followships.followingId')), 'followerCount'],
        [Sequelize.fn('count', Sequelize.col('followships.followerId')), 'followingCount'],
        [Sequelize.fn('count', Sequelize.col('likes.userId')), 'likeCount'],
        [Sequelize.fn('count', Sequelize.col('replies.userId')), 'replyCount']
      ],
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'followers' },
        { model: Like, attributes: [] },
        { model: Reply, attributes: [] }
      ],
      group: ['id']
    })
  }
}

module.exports = adminService
