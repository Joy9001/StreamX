import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import AdminPanel from './AdminPanel/AdminPanel.jsx'
import Login from './components/Auth/Login.jsx'
import LoginEditor from './components/Auth/LoginEditor.jsx'
import SignUp from './components/Auth/SignUp.jsx'
import Profile from './components/Profile.jsx'
import ProfileForm from './components/ProfileForm.jsx'
import Request_Approve from './components/Request&Apporved/main.jsx'
import Storage from './components/Storage/Storage.jsx'
import HiredEditor from './HiredEditor/HiredEditor.jsx'
import { loginState } from './states/loginState.js'
import { userTypeState } from './states/userTypeState.js'
import Land from './components/Landing/LandingPage.jsx'

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
      path: '/landing',
      element: <Land />,
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
      path: '/storage',
      element: isLoggedIn ? <Storage /> : <Login />,
    },
    {
      path: '/profile/owner',
      element: isLoggedIn ? <Profile /> : <Login />,
    },
    {
      path: '/settings',
      element: isLoggedIn ? <ProfileForm /> : <Login />,
    },
    {
      path: '/HireEditor',
      element: isLoggedIn ? <HiredEditor /> : <Login />,
    },
    {
      path: '/AdminPanel',
      element: isLoggedIn ? <AdminPanel /> : <Login />,
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
