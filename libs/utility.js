module.exports = {
  generateRoomName: (id, listenerId) => {
    if (!id || !listenerId) {
      throw new Error('id or listener missed')
    }

    let roomName = ''

    const sorts = [id, listenerId]
    sorts.sort((a, b) => {
      return a - b
    })

    roomName = sorts.join('n')

    return roomName
  }
}