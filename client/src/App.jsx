import { useAuth0 } from '@auth0/auth0-react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import AdminPanel from './components/AdminPanel/AdminPanel.jsx'
import Login from './components/Auth/Login.jsx'
import LoginEditor from './components/Auth/LoginEditor.jsx'
import Logout from './components/Auth/Logout.jsx'
import SignUp from './components/Auth/SignUp.jsx'
import Profile from './components/Profile.jsx'
import ProfileForm from './components/ProfileForm.jsx'
import RequestApprove from './components/Request&Apporved/raas.jsx'
import Storage from './components/Storage/Storage.jsx'
import HiredEditor from './components/HiredEditor/HiredEditor.jsx'

function App() {
  const { isAuthenticated } = useAuth0()

  const router = createBrowserRouter([
    {
      path: '/',
      element: isAuthenticated ? <Navigate to='/storage' replace /> : <Login />,
    },
    {
      path: '/login/owner',
      element: isAuthenticated ? <Storage /> : <Login />,
    },
    {
      path: '/raas',
      element: <RequestApprove />,
    },
    {
      path: '/signup',
      element: isAuthenticated ? <Storage /> : <SignUp />,
    },
    {
      path: '/login/editor',
      element: isAuthenticated ? <Storage /> : <LoginEditor />,
    },
    {
      path: '/logout',
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
