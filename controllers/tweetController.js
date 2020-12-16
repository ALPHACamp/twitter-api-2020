const { Tweet, User, Like, sequelize } = require('../models')
const QueryTypes = require('sequelize')

const { getUser } = require('../_helpers')

module.exports = {
  createTweet: async (req, res, next) => {
    try {
      const description = req.body.description.trim()
      // validation
      if (!description) {
        return res.status(200).json({ status: 'error', message: '不可新增空白推文' })
      }
      if (description.length > 140) {
        return res.status(200).json({ status: 'error', message: '推文字數不可超過 140 字' })
      }
      await Tweet.create({ description, UserId: getUser(req).id })
      return res.status(200).json({
        status: 'success',
        message: '新增推文成功'
      })
    } catch (err) {
      next(err)
    }
  },
  // getTweet: async (req, res, next) => {
  //   try {
  //     const tweet = await sequelize.query(
  //       `
  //       SELECT t.*, u.* as "User"
  //       FROM tweets as t
  //       JOIN users as u ON u.id = t.UserId
  //       WHERE t.id = ${Number(req.params.id)}
  //       `,
  //       { model: Tweet, mapToModel: true, type: QueryTypes.SELECT }
  //     )
  //     // const tweet = await Tweet.findByPk(req.params.id, {
  //     //   include: [User, Like]
  //     // })
  //     if (!tweet) {
  //       return res.status(200).json({ status: 'error', message: '找不到推文' })
  //     }

  //     return res.status(200).json(tweet[0])
  //   } catch (err) {
  //     next(err)
  //   }
  // },
  updateTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.status(200).json({ status: 'error', message: '找不到推文' })
      }
      if (tweet.UserId !== getUser(req).id) {
        return res.status(200).json({ status: 'error', message: '使用者非推文作者，無權限更新' })
      }
      const description = req.body.description
      if (!description) {
        return res.status(200).json({ status: 'error', message: '不可新增空白推文' })
      }
      if (description.length > 140) {
        return res.status(200).json({ status: 'error', message: '推文字數不可超過 140 字' })
      }

      await tweet.update({ description })
      return res.status(200).json({
        status: 'success',
        message: '更新推文成功'
      })
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.status(200).json({ status: 'error', message: '找不到推文' })
      }
      if (tweet.UserId !== getUser(req).id && getUser(req).role !== 'admin') {
        return res
          .status(200)
          .json({ status: 'error', message: '使用者非推文作者或管理員，無法刪除' })
      }

      await tweet.destroy({})
      return res.status(200).json({
        status: 'success',
        message: '刪除推文成功'
      })
    } catch (err) {
      next(err)
    }
  }
}
