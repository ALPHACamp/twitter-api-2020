const helpers = require('../_helpers.js')

const dateFieldsToTimestamp = (object) => {
  Object.keys(object).forEach(key => {
    if (object[key] instanceof Date) {
      object[key] = object[key].getTime()
    }
  })
  return object
}

const userDataTransform = (req, user) => {
  //user should be plain object
  return {
    ...dateFieldsToTimestamp(user),
    isFollowed: helpers.getUser(req).Followings.includes(user.id)
  }
}

const tagIsFollowed = (req, user) => {
  //user should be plain object
  return {
    ...user,
    isFollowed: helpers.getUser(req).Followings.includes(user.id)
  }
}







module.exports = {
  userDataTransform,
  dateFieldsToTimestamp,
  tagIsFollowed
}