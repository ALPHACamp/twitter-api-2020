function getUser (req) {
  return req.user
}

function getLastUpdated (data) {
  const now = new Date()
  const updatedDiff = now - new Date(data.updatedAt)
  let lastUpdated
  const diffInHours = updatedDiff / 1000 / 60 / 60
  if (diffInHours < 1) {
    lastUpdated = `${Math.round(diffInHours * 60)} 分鐘前`
  } else if (diffInHours < 24) {
    lastUpdated = `${Math.round(diffInHours)} 小時前`
  } else if (diffInHours < 720) {
    lastUpdated = `${Math.round(diffInHours / 24)} 天前`
  } else if (diffInHours < 1440) {
    lastUpdated = '一個月前'
  } else if (diffInHours < 8640) {
    lastUpdated = `${Math.round(diffInHours / 24 / 30)} 個月前`
  } else {
    lastUpdated = '一年前'
  }
  data.lastUpdated = lastUpdated
}
function getLastUpd (data) {
  const now = new Date()
  const updatedDiff = now - new Date(data.updatedAt)
  let lastUpdated
  const diffInHours = updatedDiff / 1000 / 60 / 60
  if (diffInHours < 1) {
    lastUpdated = `${Math.round(diffInHours * 60)} 分鐘前`
  } else if (diffInHours < 24) {
    lastUpdated = `${Math.round(diffInHours)} 小時前`
  } else if (diffInHours < 720) {
    lastUpdated = `${Math.round(diffInHours / 24)} 天前`
  } else if (diffInHours < 1440) {
    lastUpdated = '一個月前'
  } else if (diffInHours < 8640) {
    lastUpdated = `${Math.round(diffInHours / 24 / 30)} 個月前`
  } else {
    lastUpdated = '一年前'
  }
  return lastUpdated
}
function getDate (length = 10) {
  const dateArray = Array.from({ length }, () => {
    const random = new Date()
    random.setSeconds(Math.floor(Math.random() * length))
    return random
  })
  return dateArray
}

module.exports = {
  getUser, getLastUpdated, getLastUpd, getDate
}
