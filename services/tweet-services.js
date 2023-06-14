const helpers = require('../_helpers')

const {
    relativeTimeFromNow
} = require('../helpers/dayjs-helpers')
const {
    Tweet, User, Like, Reply
} = require('../models')

const tweetServices = {
    getTweets: async(req, cb) => {
        try {
            let tweets = await Tweet.findAll({
                include: [{
                    model: User,
                    attributes: ['name', 'avatar', 'account']
                }, {
                    model: Like,
                    attributes: ['id']
                }, {
                    model: Reply,
                    attributes: ['id']
                }],
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            if (!tweets) throw new Error("目前沒有任何推文！")
            tweets = await tweets.map(tweet => {
                const subDescription = tweet.description ? tweet.description.substring(0, 100) : ''

                return {...tweet.dataValues,
                    description: subDescription,
                    createdAt: relativeTimeFromNow(tweet.dataValues.createdAt),
                    isLiked: tweet.Likes.some(like => like.UserId === req.userId),
                    replyCount: tweet.Replies.length,
                    likeCount: tweet.Likes.length
                }
            })
            cb(null, tweets)
        } catch (err) {
            cb(err)
        }
    },
    getTweet: (req, cb) => {
        const {
            id
        } = req.params
        return Promise.all([
        Tweet.findByPk(id, {
            include: [
            User, ],
            nest: true,
            raw: true
        }),
        Like.count({
            where: {
                TweetId: id
            }
        }),
        Reply.count({
            where: {
                TweetId: id
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })])
            .then(([tweet, likes, replies]) => {
            if (!tweet) throw new Error('推文不存在！')
            return Like.findOne({
                where: {
                    UserId: helpers.getUser(req).id,
                    TweetId: id
                }
            })
                .then((like) => {
                cb(null, {...tweet,
                    likeCount: likes,
                    replyCount: replies,
                    createdAt: relativeTimeFromNow(tweet.createdAt),
                    isLiked: !! like
                })
            })
        })
            .
        catch (err => cb(err))
    },
    postTweets: async(req, cb) => {
        try {
            const {
                description
            } = req.body
            const UserId = helpers.getUser(req).id
            if (!UserId) throw new Error('查無此人!')
            if (!description) throw new Error('Tweet不能為空!')
            if (description.length > 140) throw new Error('輸入不得超過140字!')


            const tweet = await Tweet.create({
                description,
                UserId,
            })
            return cb(null, {
                status: 'success',
                message: '推文成功！',
                ...tweet.dataValues,
                createdAt: relativeTimeFromNow(tweet.dataValues.createdAt)
            })
        } catch (err) {
            cb(err)
        }
    },
    addLike: async(req, cb) => {
        try {
            const id = req.params.id
            const tweet = await Tweet.findByPk(id)
            const like = await Like.findOne({
                where: {
                    UserId: helpers.getUser(req).id,
                    TweetId: id
                }
            })
            if (!tweet) throw new Error("推文不存在!")
            if (like) throw new Error('你已經like過這篇Tweet了')
            const likeCreate = await Like.create({
                UserId: helpers.getUser(req).id,
                TweetId: Number(id)
            })
            cb(null, {
                status: '已加入喜歡！',
                ...likeCreate.toJSON(),
                isLiked: (likeCreate.UserId === helpers.getUser(req).id)
            })
        } catch (err) {
            cb(err)
        }
    },
    removeLike: async(req, cb) => {
        try {
            const {
                id
            } = req.params
            const tweet = await Tweet.findByPk(id)
            const like = await Like.findOne({
                where: {
                    UserId: helpers.getUser(req).id,
                    tweetId: id
                }
            })
            if (!tweet) throw new Error("推文不存在!")
            if (!like) {
                throw new Error('這篇Tweet沒被like')
            }
            const removelike = await like.destroy()
            cb(null, {
                message: 'Like 取消成功',
                isLiked: (removelike === helpers.getUser(req).id)
            })
        } catch (err) {
            cb(err)
        }
    }
}

module.exports = tweetServices