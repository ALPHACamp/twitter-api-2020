# Twitter API

## General info

<details open><summary>Click me</summary>

The repository contains the backend code for the project of ALPHAcamp Simple Twitter course. In the project, we were instructed to build a twitter-like website. The frontend of the project is available [here](https://), and the backend is deployed on Heroku cloud application platform [here](https://dry-lowlands-42863.herokuapp.com).

</details>

## Project features
The reason why we choose Node.js to construct the server is because it was the course syllabus. And as to database, MySQL is our choice since it's free and open-source.

Here are the features of our website.

<details open><summary>Click me</summary>
    
### Seed Data
* Seed Account (at least two shown below)
       - account (for admin): Admin, password: 12345678
       - account (for user): User1, password: 12345678
* Each user has 10 tweets, each with three response for 3 different users.

### Tweet/Comment
* Users can browse all tweets
* After clicking tweet, its content and reponse will show up.
* Users can response others' tweet
* User can neither reply or like others comment
* After clicking user's avatar, his/her info and tweets are shown
* User can add tweet

### User Interaction
* User can follow/unfollow other users
* User can press Like/Unlike on others' tweet
* User can edit their own profile

### Metrics Summary
* Any valid user can browse the data below:
       - Tweets
       - Comment
       - Following
       - Follower
       - Like
* User can view users with top 10 followers in the side bar

### Backstage
* Admin should login via specific page
* Admin can browse all tweets
* Admin can browse all users and all summary data

</details>

## Prerequisites
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en) v14.16
* [MySQL](https://www.mysql.com/)

## How to install
### Using Git
```
git clone https://github.com/freeway26tw/twitter-api-2020.git
```
### Install npm dependencies
```
cd twitter-api-2020
npm install
npm start
```

### Setting up environments
1. You will find a file named `.env.example` on root directory of project.
2.  Create a new file by copying and pasting the file and then renaming it to just `.env`
`cp .env.example .env`
4. The file `.env` is already ignored, so you never commit your credentials.
5. Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

<table>
  <tr>
    <td>JWT_SECRET</td>
    <td>CLOUD_NAME</td>
    <td>CLOUDINARY_API_KEY</td>
    <td>CLOUDINARY_API_SECRET</td>
  </tr>
  <tr>
    <td>Your secret key</td>
    <td colspan="3">Please refer to the account detail of cloudinary dashboard</td>
  </tr>
</table>


## Project structure
```sh
.
├── app.js
├── package.json
├── config
│   ├── config.json
│   └── passport.js
├── controllers
│   ├── admin-controller.js
│   ├── followship-controller.js
│   ├── tweet-controller.js
│   └── user-controller.js
├── middleware
│   ├── api-auth.js
│   ├── error-handler.js
│   └── multer.js
├── migrations
├── models
│   ├── followship.js
│   ├── index.js
│   ├── like.js
│   ├── reply.js
│   ├── role.js
│   ├── tweet.js
│   └── user.js
├── routes
│   ├── index.js
│   └── apis
│       ├──index.js
│       └──modules
│          ├──admin.js
│          ├──followships.js
│          ├──tweets.js
│          └──users.js
├── seeders
├── test
└── _helper.js
```

## How to run
```
npm run dev
```
You can check if the server is running from the message below
```
Twitter app listening on port 3000!
Press CTRL + C to stop the process.
```

## Test
`npm run test`

## Bugs or improvements
Every project needs improvements, Feel free to report any bugs or improvements. Pull requests are always welcome.

## Contributing
[傑銘](https://github.com/freeway26tw)
[Ian](https://github.com/Ian920511)