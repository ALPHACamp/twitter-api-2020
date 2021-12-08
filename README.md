# Alphitter

Alphitter is a platform  for user to share their life with their friends


## Feature

you can login to this platform  from  user login and admin login page
you can set up your user access with account, name, email, password
if you need a admin access, we only allow to set it up from  database

As a user, you should be able to 

- set up your personal profile including account, name, upload your cover photo and avatar and give an short introduction about yourself
- you can like/unlike a post
- you can follow the account you find interested in
- you can navigate to others profile and check all of their post and their following and followers
- on the landing page, you can see the top 10 user which have most followers 
- you can view all of your tweets, replies, liked post in one page

As a admin user, you should be able to 

- monitor user activity on the platform including how many followers they have and how many likes they received on their post
- view and delete a tweet


## Getting Started

Clone repository https://github.com/paulchnag0801/twitter-api-2020.git

    git clone 

Install Dependancies

    npm install

Spin up server

**if you have nodemon**

    npm run dev

**if you dont have nodemon**

    npm run start

The website should start running on

    http://localhost:3000/

Set up .env file

    please change .env.example to .env and change the SKIP parameter to your own credentials

## Set up data base

In this project, we use MySQL

Create database in MySQL

`create database ac_twitter_workspace;`

Set up data base

    npx seqeulize db:migrate

Set up seed 

    npx sequelize db:seed:all

## User login

we provide both user and admin access. Please use below login to test user and admin feature

| Role | User account | Password |
| ----------- | ----------- | ----------- |
| Admin | root | 12345678 |
| User | user1 | 12345678 |

## Author

Heidi Chen
