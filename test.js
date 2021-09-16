// for (let i = 0; i < arr.length; i++) {
//   console.log(arr[i]);
// }
const faker = require('faker')

let tweets = []
for (let i = 0; i < 10; i++) {
  let tweet = {
    userId: Math.floor(Math.random() * 10),
    description: faker.lorem.text().substring(0, 140)
  }
  tweets.push(tweet)
}

console.log(tweets)