const db = require('../models')
const User = db.User
const helpers = require('../_helpers.js')
const { sequelize } = require('../models')
const imgur = require('imgur-node-api')

const dateFieldsToTimestamp = (table) => {
  return [
    [sequelize.literal(`UNIX_TIMESTAMP(${table}.createdAt) * 1000`), 'createdAt']
  ]
}

const repliesAndLikeCount = () => {
  return [
    [sequelize.literal(`(SELECT COUNT(*) FROM Likes AS l WHERE l.TweetId=Tweet.id)`), 'likesCount'],
    [sequelize.literal(`(SELECT COUNT(*) FROM Replies AS r WHERE r.TweetId=Tweet.id)`), 'repliesCount']
  ]
}

const tagIsFollowed = (req, user) => {
  //user should be plain object
  console.log('@@', helpers.getUser(req).Followings)
  return {
    ...user,
    isFollowed: helpers.getUser(req).Followings && helpers.getUser(req).Followings.includes(user.id)
  }
}

const getSimpleUserIncluded = () => {
  return [{
    model: User,
    attributes: ['id', 'name', 'account', 'avatar']
  }]
}

const uploadImgur = (file) => {
  imgur.setClientID(process.env.IMGUR_CLIENT_ID)
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    imgur.upload(file[0].path, (err, img) => {
      if (err) return reject({ status: 'error', message: '圖片上傳失敗' })
      resolve(img.data.link)
    })
  })
}

module.exports = {
  dateFieldsToTimestamp,
  tagIsFollowed,
  repliesAndLikeCount,
  getSimpleUserIncluded,
  uploadImgur
}