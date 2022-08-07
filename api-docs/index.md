# API routes index  

## Admin related  
| API routes                                               | feature                | Authentication |
| -------------------------------------------------------- | ---------------------- | -------------- |
| [`GET` /api/admin/users](./admin/getUsers.md)            | Get data of all users  | login & admin  |
| [`POST` /api/admin/signin](./admin/adminSignin.md)       | Sign in as admin       | None           |
| [`DELETE` /api/admin/tweets/:id](./admin/deleteTweet.md) | Delete a certain tweet | login & admin  |

## User related  
| API routes                                                             | feature                                   | Authentication |
| ---------------------------------------------------------------------- | ----------------------------------------- | -------------- |
| [`GET` /api/currentUser](./users/getCurrentUser.md)                    | Get current login user data               | login          |
| [`GET` /api/users/:id](./users/getUserById.md)                         | Get data of a certain user                | login & user   |
| [`GET` /api/users/:id/tweets](./users/getUserTweets.md)                | Get tweets of a certain user              | login & user   |
| [`GET` /api/users/:id/replied_tweets](./users/getUserRepliedTweets.md) | Get replied tweets data of a certain user | login & user   |
| [`GET` /api/users/:id/likes](./users/getUserLikes.md)                  | Get likes of a certain user               | login & user   |
| [`GET` /api/users/:id/followings](./users/getUserFollowings.md)        | Get followings of a certain user          | login & user   |
| [`GET` /api/users/:id/followers](./users/getUserFollowers.md)          | Get followers of a certain user           | login & user   |
| [`POST` /api/users](./users/userSignup.md)                             | Sign up as general user                   | login & user   |
| [`POST` /api/users/signin](./users/userSignin.md)                      | Sign in as general user                   | login & user   |
| [`PUT` /api/users/:id](./users/editUser.md)                            | Update personal profile                   | login & user   |

## Followship related  
| API routes                                                                  | feature                                 | Authentication |
| --------------------------------------------------------------------------- | --------------------------------------- | -------------- |
| [`GET` /api/followships](./followships/getFollowships.md)                   | Get top 10 users who has most followers | login & user   |
| [`POST` /api/followships](./followships/addFollowship.md)                   | Add a followship                        | login & user   |
| [`DELETE` /api/followships/:followingId](./followships/deleteFollowship.md) | Delete a followship                     | login & user   |

## Tweet related  
| API routes                                    | feature                     | Authentication |
| --------------------------------------------- | --------------------------- | -------------- |
| [`GET` /api/tweets](./tweets/getTweets.md)    | Get data of all tweets      | login          |
| [`GET` /api/tweets/:id](./tweets/getTweet.md) | Get data of a certain tweet | login & user   |
| [`POST` /api/tweets](./tweets/postTweet.md)   | Post a new tweet            | login & user   |


## Reply related  
| API routes                                                     | feature                        | Authentication |
| -------------------------------------------------------------- | ------------------------------ | -------------- |
| [`GET` /api/tweets/:tweet_id/replies](./replies/getReplies.md) | Get replies of a certain tweet | login & user   |
| [`POST` /api/tweets/:tweet_id/replies](./replies/addReply.md)  | Add reply to a tweet           | login & user   |

## Like related  
| API routes                                         | feature        | Authentication |
| -------------------------------------------------- | -------------- | -------------- |
| [`POST` /api/tweets/:id/like](./likes/like.md)     | Like a tweet   | login & user   |
| [`POST` /api/tweets/:id/unlike](./likes/unlike.md) | Unlike a tweet | login & user   |

## Links  
[Back to README](../README.md)  
