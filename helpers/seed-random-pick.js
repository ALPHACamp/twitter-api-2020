module.exports = {
  randomPick: (collection, picks) => {
    // collection: array
    // picks: number
    const users = collection.slice()
    let length = collection.length

    // store picked users
    const userList = []

    for (let i = 0; i < picks; i++) {
      const index = Math.floor(Math.random() * length)
      userList.push(users[index])
      users.splice(index, 1)
      
      length--
    }

    return userList
  }
}