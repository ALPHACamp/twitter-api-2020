const { Tweet, User, Like, Reply, sequelize } = require("../models");
const { getUser } = require("../helpers/auth-helper");
const { newError } = require("../helpers/error-helper");

const tweetController = {
  // 要取得所有貼文，每則貼文要拿到user的name跟account，還有每則貼文的按讚數/回覆數量，去關聯Like/Reply
  // 感覺要用raw SQL語法
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = getUser(req).id;

      if (!currentUserId) throw newError(404, "找不到使用者");

      const tweets = await Tweet.findAll({
        replacements: [currentUserId],
        nest: true,
        raw: true,
        include: [
          {
            model: User,
            attributes: ["id", "account", "name", "avatar"],
          },
        ],
        attributes: [
          "id",
          "description",
          "createdAt",
          // 計算每筆Tweet有幾個replies
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)"
            ),
            "replyCounts",
          ],
          // 計算每筆Tweet有幾個likes
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)"
            ),
            "likeCounts",
          ],
          // 找出每筆Tweet，目前登入的使用者是否有按讚，若 EXISTS 為真，就會繼續執行外查詢中的 SQL；若 EXISTS 為假，則整個 SQL 查詢就不會返回任何結果
          [
            sequelize.literal(
              `EXISTS (SELECT id FROM Likes WHERE Likes.TweetId = Tweet.id AND Likes.UserId = ?)`
            ),
            "isLiked",
          ],
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.json(tweets);
    } catch (err) {
      return next(err);
    }
  },
  postTweet: async (req, res, next) => {
    const currentUserId = getUser(req).id;
    const description = req.body.description.trim();
    try {
      if (!description) throw newError(400, "內容不可空白");

      if (description.length > 140) throw newError(400, "字數不可超過140字");

      const tweetInput = await Tweet.create({
        UserId: currentUserId,
        description,
      });
      const user = await User.findByPk(currentUserId, {
        raw: true,
        nest: true,
        attributes: ["id", "avatar"],
      });
      return res.json({ tweetInput, user });
    } catch (err) {
      return next(err);
    }
  },
  getTweet: async (req, res, next) => {
    // 要取得該筆貼文，並關聯user(取得user的資料)，及拿到likeCounts/replyCounts/isLiked
    try {
      const tweetId = req.params.tweet_id;
      const currentUserId = getUser(req).id;
      const tweet = await Tweet.findByPk(tweetId, {
        replacements: [currentUserId],
        nest: true,
        raw: true,
        include: {
          model: User,
          attributes: ["id", "name", "account", "avatar"],
        },
        attributes: [
          "id",
          "description",
          "createdAt",
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)"
            ),
            "replyCounts",
          ],
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)"
            ),
            "likeCounts",
          ],
          [
            sequelize.literal(
              `EXISTS (SELECT id FROM Likes WHERE Likes.TweetId = Tweet.id AND Likes.UserId = ?)`
            ),
            "isLiked",
          ],
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!tweet) throw newError(404, "該貼文不存在");

      return res.json({
        ...tweet,
      });
    } catch (err) {
      return next(err);
    }
  },
  // 取得特定推文的所有回覆
  getReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id;
      const tweet = await Tweet.findByPk(tweetId);
      if (!tweet) throw newError(404, "該貼文不存在");

      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        include: {
          model: User,
          attributes: ["id", "name", "account", "avatar"],
        },
        where: { TweetId: tweetId },
        attributes: ["id", "comment", "createdAt"],
        order: [["createdAt", "DESC"]],
      });
      if (!replies.length) throw newError(404, "該貼文沒有任何留言回覆");

      return res.json(replies);
    } catch (err) {
      return next(err);
    }
  },
  // 在特定推文新增回覆
  postReply: async (req, res, next) => {
    try {
      const UserId = getUser(req).id;
      const TweetId = req.params.tweet_id;
      const comment = req.body.comment.trim();
      const tweet = await Tweet.findByPk(TweetId);
      if (!tweet) throw newError(404, "該貼文不存在");

      if (!comment) throw newError(400, "內容不可空白");

      if (comment.length > 140) throw newError(400, "字數不可超過140字");

      const replyInput = await Reply.create({
        UserId,
        TweetId,
        comment,
      });
      return res.json(replyInput);
    } catch (err) {
      return next(err);
    }
  },
  // 將指定推文加入喜歡
  addLike: async (req, res, next) => {
    try {
      const tweetId = req.params.id;
      const currentUser = getUser(req).id;
      // 先到資料庫找該筆推文是否存在及是否有被該使用者喜歡
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(tweetId),
        Like.findOne({
          where: {
            TweetId: tweetId,
            UserId: currentUser,
          },
        }),
      ]);
      if (!tweet) throw newError(404, "該貼文不存在");

      if (like) throw newError(400, "使用者已經按過讚");

      const createdLike = await Like.create({
        TweetId: tweetId,
        UserId: currentUser,
      });
      return res.json(createdLike);
    } catch (err) {
      return next(err);
    }
  },
  // 將指定推文移除喜歡
  removeLike: async (req, res, next) => {
    try {
      const tweetId = req.params.id;
      const currentUser = getUser(req).id;
      // 直接執行刪除動作，不需要先到資料庫中尋找有沒有喜歡過的紀錄，以減少對資料庫的請求次數
      const removeLike = await Like.destroy({
        where: {
          TweetId: tweetId,
          UserId: currentUser,
        },
      });
      return res.json(removeLike);
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = tweetController;
