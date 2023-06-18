const getUserData = (data) => {
  if (data) return data.map(record => record.id)
  return []
}

module.exports = {
  getUserData
}