function createRoomName(userId, currentId) {
  const array = [currentId, userId]
  array.sort((a, b) => a - b)
  const RoomName = array.join('R')
  return RoomName
}

module.exports = createRoomName