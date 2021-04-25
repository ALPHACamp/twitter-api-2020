function getUser(req) {
  return req.user
}

function getUserInfoId(req, info) {
  if (req.user[info]) return req.user[info].map(el => el.id)
  return null
}

// Make sure user exists or is not admin
function checkUser(res, user) {
  if (!user || user.role === 'admin') {
    return res.status(401).json({
      status: 'error',
      message: 'user does not exist'
    })
  }
}

function getFollowshipInfo(user, followships, currentUserFollowings) {
  const idName = followships === 'Followers' ? 'followerId' : 'followingId'

  return user.dataValues[followships].map(followship => {
    if (followship.role === 'admin') {
      return {}
    }
    return {
      [idName]: followship.id,
      name: followship.name,
      account: followship.account,
      avatar: followship.avatar,
      introduction: followship.introduction,
      createdAt: followship.createdAt,
      isFollowing: currentUserFollowings
        ? currentUserFollowings.includes(followship.id)
        : null
    }
  })
}

function getResourceInfo(user, resource, likes) {
  return user.dataValues[resource].map(el => {
    const tweet = el.Tweet
    if (!tweet) {
      return {}
    }
    return {
      id: el.id,
      comment: el.comment,
      createdAt: el.createdAt,
      TweetId: el.TweetId,
      Tweet: {
        id: tweet.id,
        description: tweet.description,
        createdAt: tweet.createdAt,
        isLiked: likes ? likes.includes(tweet.id) : null,
        User: {
          id: tweet.User.id,
          name: tweet.User.name,
          account: tweet.User.account,
          avatar: tweet.User.avatar
        },
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length
      }
    }
  })
}

module.exports = {
  getUser,
  getUserInfoId,
  checkUser,
  getFollowshipInfo,
  getResourceInfo
}
