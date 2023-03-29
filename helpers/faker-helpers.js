const faker = require('faker')

function loremFaker (num) {
  const loremText = faker.lorem.sentences(5) // 5 sentences
  if (loremText.length > num) {
    return loremText.substring(0, num)
  }
}

module.exports = {
  loremFaker
}
