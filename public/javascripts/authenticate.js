const DOMAIN = 'http://localhost:3000/'
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})
const signInForm = document.querySelector('#sign-in-form')
// const signInPage = document.querySelector('#sign-in-page')
// const chatRoomPage = document.querySelector('#chat-room')

if (signInForm) {
  signInForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    axios.post(DOMAIN + 'api/signin', {
      email: formData.get('email'),
      password: formData.get('password'),
    }).then((result) => {
      const { data } = result
      if (data.status !== 'success') throw (new Error('登入失敗'))
      localStorage.setItem('token', data.token)
      // signInPage.classList.add('hide')
      // chatRoomPage.classList.remove('hide')
      window.location.reload()
      return false
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