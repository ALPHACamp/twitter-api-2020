function generateRandomNumArr (range, pickNums) {
  const numCollections = Array.from({ length: range }, (_, i) => i)
  const randomPickedNums = []
  for (let i = 0; i < pickNums; i++) {
    randomPickedNums.push(numCollections.splice(Math.floor(Math.random() * numCollections.length), 1)[0])
  }
  return randomPickedNums
}

module.exports = { generateRandomNumArr }
