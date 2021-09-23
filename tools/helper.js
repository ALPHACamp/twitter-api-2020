const db = require('../models')
const { User } = db

async function getFollowingList(req) {
  let user = await User.findOne({
    attributes: [],
    where: { id: req.user.id },
    include: {
      model: User, as: 'Followings',
      attributes: ['id'], through: { attributes: [] }
    }
  })
  user = user.toJSON()
  return user.Followings.map(user => (user.id)) //[1,5]
}

function turnToBoolean(data, attribute) {
  if (Array.isArray(data)) {
    data.forEach(data => {
      if (data[`${attribute}`] === 1) {
        data[`${attribute}`] = true
      } else data[`${attribute}`] = false
    })
  } else {
    // 處理物件
    if (data[`${attribute}`] === 1) {
      data[`${attribute}`] = true
    } else data[`${attribute}`] = false
  }
}
module.exports = { getFollowingList, turnToBoolean }