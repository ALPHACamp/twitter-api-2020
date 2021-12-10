# Alphitter

Alphitter is a social media application simulating Twitter

# Feature
 
With Alphitter, you can do the followings

- set up your personal profile including account, name, avatar, cover photo and an introduction about yourself
- like/unlike a post
- follow other accounts
- you can navigate to others profile and check their posts and their following and followers
- view your own tweets, replies, liked post in one page
- checkout the top 10 user on the landing page 

## Getting Started (adopting mySQL database)

git clone
  - frontend: https://github.com/huangtingyu04/simple-twitter-front-end.git
  - backend: https://github.com/cschang07/twitter-api-2020.git

cd forum-express

npm install

npx sequelize db:migrate

npx sequelize db:seed:all

nodemon app.js

## User login

both user and administrator seed accounts are provided, shown in the table below:

| Role | User account | Password |
| ----------- | ----------- | ----------- |
| Admin | root | 12345678 |
| User | user1 | 1 |
| User | user2 | 2 |
| User | user3 | 3 |
| User | user4 | 4 |
| User | user5 | 5 |

*Admin account can login solely to the back stage, where you can view/delete all tweets and monitor/analyze all data(e.g. users' number of followers)

## Author

Chris

Steven

Guanmin

Emery
