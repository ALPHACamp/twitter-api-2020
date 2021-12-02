const { add } = require('lodash')
const _ = require('lodash')
const a = [
  { UserId: 2, TweetID: 2 },
  { UserId: 3, TweetID: 38 },
  { UserId: 3, TweetID: 38 }
]
let u = _.uniqBy(a, function (a) {
  return a.UserId + a.TweetID
})
u = _.reject(u, function (a) {
  return a.UserId === a.TweetID
})
console.log(u)
