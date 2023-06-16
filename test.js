{
  model: Tweet,
  attributes: {
    include: [
      [
        literal(
        '(SELECT COUNT(id) FROM Tweets WHERE Tweets.id = Tweets.id)'
        ),
        'tweetCount'
      ],
    ]
  }
}