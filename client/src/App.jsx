import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import Login from './components/Auth/Login.jsx'
import LoginEditor from './components/Auth/LoginEditor.jsx'
import Logout from './components/Auth/Logout.jsx'
import Profile from './components/Profile.jsx'
import ProfileForm from './components/ProfileForm.jsx'
import Storage from './components/Storage.jsx'
import { loginState, userState } from './states/loginState.js'

function App() {
  const isLoggedIn = useRecoilValue(loginState)
  const user = useRecoilValue(userState)
  const router = createBrowserRouter([
    {
      path: '/',
      element: isLoggedIn ? (
        user == 'owner' ? (
          <Storage />
        ) : (
          <LoginEditor />
        )
      ) : (
        <Login />
      ),
    },
    {
      path: '/login/owner',
      element: isLoggedIn ? <Storage /> : <Login />,
    },
    {
      path: '/login/editor',
      element: isLoggedIn ? <Storage /> : <LoginEditor />,
    },
    {
      path: '/logout',
      // element: isLoggedIn ? <Logout /> : <Login />,
      element: <Logout />,
    },
    {
      path: '/storage',
      element: <Storage />,
    },
    {
      path: '/profile/owner',
      element: <Profile />,
    },
    {
      path: '/settings',
      element: <ProfileForm />,
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
