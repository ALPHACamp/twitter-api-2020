const { User, Tweet } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

// setting tweet-related controller
const tweetController = {
  getTweets: (req, res, next) => {
    /*
    :query page: specific slice of all tweets
    :query limit: limit return number of tweets
    This api would return a json that concluding tweets with specific page & limit, pagination information
    */
    const DEFAULT_LIMIT = 10
    const DEFAULT_DESCRIPTION_LIMIT = 140
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Tweet.findAndCountAll({
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { nodel: User, as: 'LikedUsers', attributes: ['id', 'account', 'name', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      nest: true,
      raw: true
    })
      .then(tweets => {
        const likedTweetId = req.user?.LikedTweets ? req.user.LikedTweets.map(likeTweet => likeTweet.id): []
        const resultTweets = tweets.rows.map(r => ({
          ...r,
          description: r.description.substring(0, DEFAULT_DESCRIPTION_LIMIT),
          isLiked: likedTweetId.includes(r.id),
          totalLikes: r.LikedUser? r.LikedUser.length(): 0
        }))
        return res.json({
          status: 'success',
          statusCode: 200,
          data: {
            tweets: resultTweets,
            pagination: getPagination(limit, page, restaurants.count)
          }
        })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
