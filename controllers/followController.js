const db = require('../models')
const User = db.User
const Followship = db.Followship
const helpers = require('../_helpers')
const { Op } = require("sequelize");

const followController = {
  addFollowship: (req, res) => {
    Followship.findOne({  //TODO: 可優化成findOrCreate
      where: {
        $and: {
          followerId: helpers.getUser(req).id,
          followingId: req.body.id
        }
      }
    }).then(followship => {
      if (followship) {
        return res.json({ status: 'error', message: 'Followed already' })
      }
      Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id
      }).then(() => {
        return res.json({ status: 'success', message: 'Followed successfully' })
      })
    })
  },
  deleteFollowship: (req, res) => {
    Followship.destroy({
      where: {
        $and: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.followingId
        }
      }
    }).then(followship => {
      if (!followship) {
        return res.json({ status: 'error', message: 'Unfollowed already' })
      }
      return res.json({ status: 'success', message: 'Unfollowed successfully' })
    })
  }, getTopFollowers: (req, res) => {
    return User.findAll({
      where: { role: { [Op.is]: null } },  // 排除管理者
      include: [{
        model: User, as: 'Followers',
        attributes: { exclude: ['password'] } // 去除密碼欄位
        // attributes: [[Sequelize.fn('COUNT', Sequelize.col("followerId")), "followersCount"]] //可運作但沒有新增followerscount欄位
      }],
      attributes:
      {
        exclude: ['password'] // 去除密碼欄位
      },
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length, //追蹤者人數
        // isFollowed: 是否被登入中的使用者追蹤
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
      return res.json(users)
    })
  }
}


module.exports = followController