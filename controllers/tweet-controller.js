const { Tweet, User, Comment } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Promise.all([Tweet.findAll({
        raw: true,
        nest: true,
        include: User,
        order: [['createdAt', 'DESC']]
      }), Comment.findAndCountAll()])
      // console.log(tweets)

      return res.json(tweets)
    } catch (err) {
      next(err)
    }
  }

//      {
//         "id": 1,
//         "UserId": 2,
//         "description": "Sit aut accusamus. Maxime illo et doloremque eveniet architecto velit. Nisi culpa ut. Impedit repellendus minima occaecati. Reiciendis consequuntur autem delectus soluta quia necessitatibus nulla quas dolore. Autem deserunt corrupti rem labore dicta.",
//         "createdAt": "2022-12-11T07:03:12.000Z",
//         "updatedAt": "2022-12-11T07:03:12.000Z",
//         "User": {
//             "id": 2,
//             "email": "user1@example.com",
//             "account": "user1",
//             "password": "$2a$10$58LoTAdFEowqS94iE9YbhODKKdb0Kslg4XkL/9mv26Vl7AaNcwuOO",
//             "name": "user1",
//             "avatar": "https://loremflickr.com/320/240/man,woman/?random=69",
//             "cover": "https://picsum.photos/1500/800",
//             "introduction": "Aliquid rerum ea quo qui quo. Adipisci cumque voluptatum magnam est est minus. Dolorum totam et rerum. Saepe aperiam asperiores natus iste omnis earum quo. Consectetur voluptatem voluptatibus enim. Esse et consequatur.",
//             "role": "user",
//             "createdAt": "2022-12-11T07:03:11.000Z",
//             "updatedAt": "2022-12-11T07:03:11.000Z"
//         }


// ◆ 推文id(tweetId)
// ◆ 使用者id(userId)
// ◆ 使用者頭像(avatar)
// ◆ 使用者名稱(name)
// ◆ 使用者帳號(account)
// ◆ 推文建立時間(createdAt)
// ◆ 推文內容(tweetContent)
// ◆ 回覆數量(commentCount)
// ◆ 喜歡數量(likeCount)
// ◆ 是否喜歡(isLiked)
// ◆ 是否已追蹤(isFollowed)


  // postTweets: (req, res, next) => {

  // }
}

module.exports = tweetController

// POST	/api/tweets/:id/like	喜歡某則tweet
// POST	/api/tweets/:id/unlike	取消喜歡某則tweet
// POST	/api/tweets/:id/replies	新增回覆
// GET	/api/tweets/:id/replies	讀取回覆
// POST	/api/tweets	新增tweets
// GET	/api/tweets	查看tweets
// GET	/api/tweets/:id	查看特定tweet
