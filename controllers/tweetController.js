const { User, Tweet, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
    // 瀏覽全部推文
    getTweets: async (req, res) => {
        return Tweet.findAll({
            include: [{
                model: User,
                attributes: ['id', 'name', 'account', 'avatar']
            }],
            attributes: {
                // 資料庫端運行計算
                include: [
                    [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
                    [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount']
                ]
            },
            limit: 2,
            raw: true,
            nest: true,
            order: [
                // 資料庫端進行排列
                [sequelize.literal('createdAt'), 'DESC']
            ]
        }).then(tweets => {
            // tweets = tweets.map(r => ({
            //   ...r,
            //   likeCount: likeCount
            // }))
            console.log('---------tweets', tweets)
            return res.status(200).json(tweets)
        }).catch(error => console.error(error))
    },

    getTweet: (req, res) => {
        return Tweet.findByPk(req.params.id, {
            include: [User]
        }).then(tweets => {
            return res.json(tweets)
        }).catch(error => console.error(error))
    },
    postTweet: (req, res) => {
        return Tweet.create({
            description: req.body.description,
            UserId: helpers.getUser(req).id
        })
            .then((category) => {
                return res.status(200).json({ status: 'success', message: 'Tweet was successfully created' })
            })

            .catch(error => console.error(error))
    },
    deleteTweet: (req, res) => {
        return Tweet.findByPk(req.params.id)
            .then(async (tweet) => {
                await tweet.destroy()
                return res.json({ status: 'success', message: 'Tweet was successfully deleted' })
            })
            .catch(error => console.error(error))
    },

    putTweet: (req, res) => {
        return Tweet.findByPk(req.params.id)
            .then((tweet) => {
                tweet.update(req.body)
                    .then((category) => {
                        return res.json({ status: 'success', message: 'category was successfully to update', data: req.body })
                    })
            })
            .catch(error => console.error(error))
    },

    postLike: (req, res) => {
        return Like.create({
            UserId: helpers.getUser(req).id,
            TweetId: req.params.id
        })
            .then((tweet) => {
                return res.json({ status: 'success', message: 'like was successfully create' })
            })
            .catch(error => console.error(error))
    },
    deleteLike: (req, res) => {
        return Like.findOne({
            where: { UserId: helpers.getUser(req).id, TweetId: req.params.id },
        })
            .then(async (like) => {
                like.destroy()
                return res.json({ status: 'success', message: 'like was successfully deleted' })
            })
            .catch(error => console.error(error))

    },
    getReplies: async (req, res) => {
        return Reply.findAll({
            where: { TweetId: req.params.tweet_id },
            include: [{
                model: User,
                attributes: ['id', 'name', 'account', 'avatar']
            }],
            raw: true,
            nest: true,
            order: [
                // 資料庫端進行排列
                [sequelize.literal('createdAt'), 'DESC']
            ]
        }).then(replies => {
            return res.status(200).json(replies)
        }).catch(error => console.error(error))
    },
    postReply: async (req, res) => {
        return Reply.create({
            comment: req.body.comment,
            UserId: helpers.getUser(req).id,
            TweetId: req.params.tweet_id
        })
            .then((reply) => {
                return res.json({ status: 'success', message: 'reply was successfully create' })
            })
            .catch(error => console.error(error))
    }

}
module.exports = tweetController
