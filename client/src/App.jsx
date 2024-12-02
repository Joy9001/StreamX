import { useAuth0 } from '@auth0/auth0-react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import AdminPanel from './components/AdminPanel/AdminPanel.jsx'
import Login from './components/Auth/Login.jsx'
import HiredEditor from './components/HiredEditor/HiredEditor.jsx'
import Profile from './components/OwnerProfile/Profile.jsx'
import RequestApprove from './components/Request&Apporved/raas.jsx'
import Storage from './components/Storage/Storage.jsx'

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
      element: isAuthenticated ? <Storage /> : <Login />,
    },
    {
      path: '/login/editor',
      element: isAuthenticated ? <Storage /> : <Login />,
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
      path: '/HireEditor',
      element: <HiredEditor />,
    },
    {
      path: '/AdminPanel/*',
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
