import { NavLink } from 'react-router-dom'

function Home() {
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
