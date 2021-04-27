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
    return res.status(404).json({
      status: 'error',
      message: 'user does not exist'
    })
  }
}

function getFollowshipInfo(user, followships, currentUserFollowings) {
  const idName = followships === 'Followers' ? 'followerId' : 'followingId'

  return user.dataValues[followships].map(followship => {
    if (followship.role === 'admin') {
      return null
    }
    return {
      [idName]: followship.id,
      name: followship.name,
      account: followship.account,
      avatar: followship.avatar,
      introduction: followship.introduction,
      createdAt: followship.Followship.createdAt,
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
      return null
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

const db = require('./models')
const User = db.User

async function checkUserInfo(req) {
  const errors = []
  const { account, name, email, password, checkPassword } = req.body
  const emailRule = /^\w+((-\w+)|(\.\w+)|(\+\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/

  // Before creating an account or updating account info ,
  // make sure all the required fields are correctly filled out
  if (!account || !name || !email || !password || !checkPassword) {
    errors.push({ message: 'Please fill out all fields.' })
  }
  if (email.search(emailRule) === -1) {
    errors.push({ message: 'Please enter the correct email address.' })
  }
  if (password.length < 4 || password.length > 12) {
    errors.push({ message: 'Password does not meet the required length' })
  }
  if (password !== checkPassword) {
    errors.push({ message: 'Password and checkPassword do not match.' })
  }
  if (name.length > 50) {
    errors.push({ message: 'Name can not be longer than 50 characters.' })
  }
  if (account.length > 50) {
    errors.push({
      message: 'Account can not be longer than 50 characters.'
    })
  }

  if (errors.length > 0) return { errors }

  // email amd account should be unique
  const check = { email, account }
  for (const key in check) {
    const value = check[key]
    const user = await User.findOne({ where: { [key]: value } })

    // setting page
    if (getUser(req)) {
      if (user && value !== getUser(req)[key]) {
        return { value, key }
      }
    }

    // register page
    if (!getUser(req) && user) {
      return { value, key }
    }
  }
}

module.exports = {
  getUser,
  getUserInfoId,
  checkUser,
  getFollowshipInfo,
  getResourceInfo,
  checkUserInfo
}
