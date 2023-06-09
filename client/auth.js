import axios from 'axios'
const authURl = 'https://tranquil-basin-75437.herokuapp.com'
export const login = async ({ email, password }) => {
  try {
    const { data } = await axios.post(`${authURl}/api/users/login`, { email, password })
    return data
  } catch (err) {
    return err
  }
}
