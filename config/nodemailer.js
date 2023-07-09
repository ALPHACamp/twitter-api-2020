require('dotenv').config()

const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENT_ID, // ClientID
  process.env.OAUTH_CLIENT_SECRET, // Client Secret
  'https://developers.google.com/oauthplayground' // Redirect URL
)

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'vertify49@gmail.com',
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: oauth2Client.getAccessToken()
  }
})

module.exports.sendConfirmationEmail = (name, email, confirmToken) => {
  console.log('Check')
  transporter
    .sendMail({
      from: 'vertify49@gmail.com',
      to: `${email}`,
      subject: 'Please confirm your account',
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for signup Twitter. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:3000/api/confirm/${confirmToken}> Click here</a>
        </div>`
    })
    .catch((err) => console.log(err))
}
