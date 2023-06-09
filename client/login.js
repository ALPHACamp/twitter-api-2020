const authURL = 'https://tranquil-basin-75437.herokuapp.com'

const login = async ({ account, password }) => {
  try {
    const data = await axios.post(`${authURL}/api/users/login`, { account, password })
    return data
  } catch (err) {
    console.log('return with error')
    return err
  }
}

const LoginPage = async () => {
  const account = 'user1'
  const password = '1234'

  const data = await login({ account, password })

  if (data.status === 200) {
    console.log('success')
    console.log(data.status)
    console.log(data)
  } else {
    console.log('error')
    console.log(data.response.status)
    console.log(data.response.data)
  }
}

LoginPage()
