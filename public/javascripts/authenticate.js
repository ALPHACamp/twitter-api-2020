const DOMAIN = 'http://localhost:3000/'
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})
const signInForm = document.querySelector('#sign-in-form')

if (signInForm) {
  signInForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    axios.post(`https://merry-simple-twitter.herokuapp.com/api/signin`, {
      email: formData.get('email'),
      password: formData.get('password'),
    }).then((result) => {
      const { data } = result
      if (data.status !== 'success') throw (new Error('登入失敗'))
      localStorage.setItem('token', data.token)
      event.target.submit()
    })
      .catch(error => {
        console.log(error)
        Toast.fire({
          icon: 'warning',
          title: '登入失敗，請確認您輸入了正確的帳號密碼'
        })
      })
  })
}