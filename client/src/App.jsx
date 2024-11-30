import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import AdminPanel from './components/AdminPanel/AdminPanel.jsx'
import Login from './components/Auth/Login.jsx'
import LoginEditor from './components/Auth/LoginEditor.jsx'
import Logout from './components/Auth/Logout.jsx'
import SignUp from './components/Auth/SignUp.jsx'
import Profile from './components/Profile.jsx'
import ProfileForm from './components/ProfileForm.jsx'
import Request_Approve from './components/Request&Apporved/main.jsx'
import Storage from './components/Storage/Storage.jsx'
import HiredEditor from './components/HiredEditor/HiredEditor.jsx'
import { loginState, userTypeState } from './states/loginState.js'

function App() {
  const isLoggedIn = useRecoilValue(loginState)
  const userType = useRecoilValue(userTypeState)
  const router = createBrowserRouter([
    {
      path: '/',
      element: isLoggedIn ? (
        userType == 'owner' ? (
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
      path: '/raas',
      element: <Request_Approve />,
    },
    {
      path: '/signup',
      element: isLoggedIn ? <Storage /> : <SignUp />,
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
    {
      path: '/HireEditor',
      element: <HiredEditor />,
    },
    {
      path: '/AdminPanel',
      element: <AdminPanel />,
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
