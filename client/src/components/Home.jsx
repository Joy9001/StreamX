import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

function Home() {
  // const [user, setUser] = useState(null)

  // const getUser = async () => {
  //   try {
  //     const url = 'http://localhost:5000/auth/login/success'
  //     const { data } = await axios.get(url, { withCredentials: true })
  //     setUser(data.user._json)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // useEffect(() => {
  //   getUser()
  // }, [])

  return (
    <div data-theme='pastel' className='min-h-screen bg-base-200'>
      <h1>Home Page</h1>
      <nav>
        <NavLink to='/login'>
          <li>Login</li>
        </NavLink>
        <NavLink to='/signup'>
          <li>SignUp</li>
        </NavLink>
        <NavLink to='/dashboard'>
          <li>Dashboard</li>
        </NavLink>
      </nav>
    </div>
  )
}

export default Home
