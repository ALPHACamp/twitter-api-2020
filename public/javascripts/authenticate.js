// const axios = require('axios');

const signInForm = document.querySelector('#sign-in-form')

console.log('@@authenticate js')
console.log('@@signInForm', signInForm)
if (signInForm) {
  signInForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    console.log('@@', formData)
    axios.create({
      baseURL: 'https://merry-simple-twitter.herokuapp.com/api',
    }).get(`/users/3/tweets`, {
      headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjA4ODk5NzkwfQ.d0DcSnteHDivsJOmnCi3M0iFPcf_SNXemd8_GOlO6Sw` }
    }).then((data) => console.log('@@axios', data))
      .catch(error => console.log(error))
  })
}