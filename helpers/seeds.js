module.exports = {
  randomPicks: (collection, numberOfPicks) => {
    // This function return specified numbers of elements in collection
    // collection => []
    // numberOfPicks => int
    const picks = []
    const array = collection.slice()
    let length = array.length

    for (let i = 0; i < numberOfPicks; i++) {
      let randomIndex = Math.floor(Math.random() * length)
      picks.push(array[randomIndex])
      array.splice(randomIndex, 1)
      length -= 1
    }

    return picks
  }
}
