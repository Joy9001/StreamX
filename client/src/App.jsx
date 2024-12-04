import { useAuth0 } from '@auth0/auth0-react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import AdminPanel from './components/AdminPanel/AdminPanel.jsx'
import EditorUi from './components/EditorProfile/EditorUi.jsx'
import GigProfile from './components/GigProfile/GigProfile.jsx'
import HiredEditor from './components/HiredEditor/HiredEditor.jsx'
import Landing from './components/LandingPage/Landing.jsx'
import Profile from './components/OwnerProfile/Profile.jsx'
import RequestApprove from './components/Request&Apporved/raas.jsx'
import Storage from './components/Storage/Storage.jsx'

function App() {
  const { isAuthenticated } = useAuth0()

  const router = createBrowserRouter([
    {
      path: '/',
      element: isAuthenticated ? (
        <Navigate to='/storage' replace />
      ) : (
        <Landing />
      ),
    },
    {
      path: '/profile/owner',
      element: isAuthenticated ? <Profile /> : <Landing />,
    },
    {
      path: '/profile/editor',
      element: isAuthenticated ? <EditorUi /> : <Landing />,
    },
    {
      path: '/gig-profile',
      element: isAuthenticated ? <GigProfile /> : <Landing />,
    },
    {
      path: '/storage',
      element: isAuthenticated ? <Storage /> : <Landing />,
    },
    {
      path: '/req-n-approve',
      element: isAuthenticated ? <RequestApprove /> : <Landing />,
    },
    {
      path: '/hire-editors',
      element: isAuthenticated ? <HiredEditor /> : <Landing />,
    },
    {
      path: '/admin-panel',
      element: isAuthenticated ? <AdminPanel /> : <Landing />,
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
