const { User, Tweet, Like, sequelize } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
	getTweets: async (req, res, next) => {
		try {
			const currentUserId = getUser(req).id
			const tweets = await Tweet.findAll({
				nest: true,
				raw: true,
				include: { model: User, attributes: ['id', 'account', 'name', 'avatar', 'cover'] },
				attributes: [
					'id', 'description', 'createdAt',
					[sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyCount'],
					[sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'LikeCount'],
					[sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${currentUserId})`), 'ifLiked']
				],
				order: [['createdAt', 'DESC']],
			})
			return res.json(tweets)
		} catch (err) {
			next(err)
		}
	}
}

module.exports = tweetController
