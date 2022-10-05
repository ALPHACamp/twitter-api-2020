
user = [ { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 } ]
tweet = [ { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 } ]


console.log(replyGenerate(user,tweet,3))

function replyGenerate(user,tweet, NumberOfReplyPerTweet){
    let result = []
    const userList = new Set()    

    for (let i = 0 ; i < tweet.length ; i++){
        while(userList.size < NumberOfReplyPerTweet ){
            userList.add(user[Math.floor( Math.random()*user.length)].id)
        }
        userList.forEach(userId => {
            result.push({
                UserId:userId,
                TweetId:tweet[i].id,
            //   comment:faker.lorem.text(),
            //   createdAt: dayJs.between('2022-10-05', '2022-11-05').format('YYYY-MM-DD HH:MM:ss'),
            //   updatedAt: new Date()
            })
        })
      userList.clear()
    }
    return result
  }