const users = [{ id: 56 }, { id: 57 }, { id: 58 }, { id: 59 }, { id: 60 }]
const tweets = [
  { id: 501 }, { id: 502 }, { id: 503 }, { id: 504 },
  { id: 505 }, { id: 506 }, { id: 507 }, { id: 508 },
  { id: 509 }, { id: 510 }, { id: 511 }, { id: 512 },
  { id: 513 }, { id: 514 }, { id: 515 }, { id: 516 },
  { id: 517 }, { id: 518 }, { id: 519 }, { id: 520 },
  { id: 521 }, { id: 522 }, { id: 523 }, { id: 524 },
  { id: 525 }, { id: 526 }, { id: 527 }, { id: 528 },
  { id: 529 }, { id: 530 }, { id: 531 }, { id: 532 },
  { id: 533 }, { id: 534 }, { id: 535 }, { id: 536 },
  { id: 537 }, { id: 538 }, { id: 539 }, { id: 540 },
  { id: 541 }, { id: 542 }, { id: 543 }, { id: 544 },
  { id: 545 }, { id: 546 }, { id: 547 }, { id: 548 },
  { id: 549 }, { id: 550 }
]

const getRandom = usedNums => {
  const random = Math.floor(Math.random() * (tweets.length))
  return ccc(random, usedNums)
}
function ccc (random, usedNums) {
  if (usedNums.includes(random)) {
    getRandom(usedNums)
  }
  usedNums.push(random)
  return random
}

let targetArr = []
for (let j = 0; j < users.length - 2; j++) {
  const usedNums = []
  targetArr = targetArr.concat(

    // console.log(getRandom(usedNums))
    // console.log('type')
    // console.log('type')
    // console.log(Array.from({ length: 9 - j }, (_, i) => ({
    // console.log(
    Array.from({ length: 1 }, (_, i) => ({ // 先少點，好觀察
      created_at: new Date(),
      updated_at: new Date(),
      user_id: users[j].id,
      tweet_id: tweets[getRandom(usedNums)].id
      // tweet_id: 1
    }))
  // )
  )
  // console.log('out Fn.')
  // console.log('out Fn.')
  // console.log(usedNums)
}
console.log(targetArr)
