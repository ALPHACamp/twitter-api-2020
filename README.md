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

1. Clone the repository
   ```
   git clone -b master https://github.com/cschang07/twitter-api-2020.git
   ```
2. Go to the file on your terminal
   ```
   cd twitter-api-2020
   ```
3. Install the kits
   ```
   npm install
   ```
4. Make an .env file according to the content of the .env.example file you will find in the repo
5. Go to config/config.json and change username and password under 'development' to match your mySQL data
6. Go to mySQL workbench
   ```
   create database ac_twitter_workspace;
   ```
7. Set up the data
   ```
   npx sequelize db:migrate
   ```
8. Set up seed data
   ```
   npx sequelize db:seed:all
   ```

10. Then you are good to run the server
   ```
   npm run dev
   ```
## User login

both user and administrator seed accounts are provided, shown in the table below:

| Role | User account | Password |
| ----------- | ----------- | ----------- |
| User | user1 | 1 |
| User | user2 | 2 |
| User | user3 | 3 |
| User | user4 | 4 |
| User | user5 | 5 |
| Admin | root | 12345678 |

*Admin account can login solely to the back stage, where you can view/delete all tweets and monitor/analyze all data(e.g. users' number of followers)

## Author

Chris

Steven

Guanmin

Emery
