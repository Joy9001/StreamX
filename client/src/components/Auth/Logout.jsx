import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()

  const logout = () => {
    console.log('logout function called')

    // Call your backend to handle the Google logout
    axios
      .get('http://localhost:5000/auth/logout')
      .then((res) => {
        console.log(res.data)
        console.log('cookie', document.cookie)
        document.cookie =
          'connect.sid=; Max-Age=0; path=/; domain=http://localhost:5173'
        console.log('cookie', document.cookie)
        navigate('/login') // Redirect to login page after successful logout
      })
      .catch((err) => {
        console.log(err)
        // navigate('/login') // Redirect even if there's an error
      })
  }

  return (
    <>
      <div>Logout</div>
      <button onClick={logout}>Logout</button>
    </>
  )
}

export default Logout
