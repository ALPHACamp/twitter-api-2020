const jwt = require('jsonwebtoken')
const { User, Tweet, sequelize } = require('../models')
const helpers = require('../_helpers')

const adminController = {
	login: (req, res, next) => {
		const adminData = helpers.getUser(req).toJSON()
		delete adminData.password
		try {
			const token = jwt.sign(adminData, process.env.JWT_SECRET, { expiresIn: '30d' })
			res.status(200).json({
				token,
				user: adminData
			})
		} catch (err) { next(err) }
	},
	getUsers: async (req, res, next) => {
		try {
			const usersData = await User.findAll({
				nest: true,
				raw: true,
				attributes: [
					'id', 'account', 'email', 'name', 'avatar', 'introduction', 'cover', 'role', 'followingCount', 'createdAt', 'updatedAt',
					[sequelize.literal('(SELECT COUNT(id) FROM Tweets WHERE Tweets.user_id = User.id)'), 'tweetCount'],
					[sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.user_id = User.id)'), 'likeCount'],
					[sequelize.literal('(SELECT COUNT(id) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount']
				],
				order: [['createdAt', 'DESC']]
			})
			const dataOrder = await usersData.sort(function (a, b) {
				return a.tweetCount < b.tweetCount
			})
			console.log(dataOrder)
			res.status(200).json(usersData)
		} catch (err) { next(err) }
	},
	getTweets: async (req, res, next) => {
		try {
			const tweets = await Tweet.findAll({
				nest: true,
				raw: true,
				include: {
					model: User,
					attributes: ['id', 'account', 'name', 'avatar', 'cover']
				},
				order: [['createdAt', 'DESC']]
			})
			return res.status(200).json(tweets)
		} catch (err) { next(err) }
	},
	deleteTweet: async (req, res, next) => {
		try {
			const tweet = await Tweet.findByPk(req.params.id)
			if (!tweet) {
				return res.status(404).json(
					{ status: '404', message: 'Tweet did not exist!' }
				)
			}
			await res.status(200).json(tweet)
			await tweet.destroy()
		} catch (err) { next(err) }
	}
}

module.exports = adminController
