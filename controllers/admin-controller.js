const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const dayjs = require('dayjs')
const { User, Tweet } = require('../models')
const adminController = {
  signIn: (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req).toJSON()
      if (loginUser?.role === 'user') return res.status(403).json({ status: 'error', message: 'Permission denied.' })
      delete loginUser.password
      loginUser.createdAt = dayjs(loginUser.createdAt).valueOf()
      loginUser.updatedAt = dayjs(loginUser.updatedAt).valueOf()
      const token = jwt.sign(loginUser, process.env.JWT_SECRET, { expiresIn: '5d' })
      res.status(200).json({ status: 'success', data: { token, user: loginUser } })
    } catch (err) { next(err) }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        attributes: ['id', 'description', 'createdAt'],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      const data = tweets.map(tweet => ({ ...tweet, description: tweet?.description.slice(0, 50), createdAt: dayjs(tweet.createdAt).valueOf() }))
      return res.status(200).json(data)
    } catch (err) { next(err) }
  }
}
module.exports = adminController
