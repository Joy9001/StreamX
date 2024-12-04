import { useAuth0 } from '@auth0/auth0-react'
import { useSelector } from 'react-redux'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Dashboard as EditorDashboard } from './components/AdminPanel/AdminEditorDashboard.jsx'
import { Dashboard as OwnerDashboard } from './components/AdminPanel/AdminOwnerDashboard.jsx'
import AdminPanel from './components/AdminPanel/AdminPanel.jsx'
import { Dashboard as VideosDashboard } from './components/AdminPanel/AdminVideosDashboard.jsx'
import EditorUi from './components/EditorProfile/EditorUi.jsx'
import GigProfile from './components/GigProfile/GigProfile.jsx'
import HiredEditor from './components/HiredEditor/HiredEditor.jsx'
import Landing from './components/LandingPage/Landing.jsx'
import Profile from './components/OwnerProfile/Profile.jsx'
import RequestApprove from './components/Request&Apporved/raas.jsx'
import Storage from './components/Storage/Storage.jsx'
function App() {
  const { isAuthenticated } = useAuth0()
  const userData = useSelector((state) => state.user.userData)
  const isAdmin = userData?.user_metadata?.role === 'Admin'

  const router = createBrowserRouter([
    {
      path: '/',
      element: isAuthenticated ? (
        isAdmin ? (
          <Navigate to='/admin-panel' replace />
        ) : (
          <Navigate to='/storage' replace />
        )
      ) : (
        <Landing />
      ),
    },
    {
      path: '/profile/owner',
      element: isAuthenticated ? (
        isAdmin ? (
          <Navigate to='/admin-panel' replace />
        ) : (
          <Profile />
        )
      ) : (
        <Landing />
      ),
    },
    {
      path: '/profile/editor',
      element: isAuthenticated ? (
        isAdmin ? (
          <Navigate to='/admin-panel' replace />
        ) : (
          <EditorUi />
        )
      ) : (
        <Landing />
      ),
    },
    {
      path: '/gig-profile',
      element: isAuthenticated ? (
        isAdmin ? (
          <Navigate to='/admin-panel' replace />
        ) : (
          <GigProfile />
        )
      ) : (
        <Landing />
      ),
    },
    {
      path: '/storage',
      element: isAuthenticated ? (
        isAdmin ? (
          <Navigate to='/admin-panel' replace />
        ) : (
          <Storage />
        )
      ) : (
        <Landing />
      ),
    },
    {
      path: '/req-n-approve',
      element: isAuthenticated ? (
        isAdmin ? (
          <Navigate to='/admin-panel' replace />
        ) : (
          <RequestApprove />
        )
      ) : (
        <Landing />
      ),
    },
    {
      path: '/hire-editors',
      element: isAuthenticated ? (
        isAdmin ? (
          <Navigate to='/admin-panel' replace />
        ) : (
          <HiredEditor />
        )
      ) : (
        <Landing />
      ),
    },
    {
      path: '/admin-panel',
      element: isAuthenticated ? (
        isAdmin ? (
          <AdminPanel />
        ) : (
          <Landing />
        )
      ) : (
        <Landing />
      ),
    },
    {
      path: '/admin-panel/owners',
      element: isAuthenticated ? (
        isAdmin ? (
          <OwnerDashboard />
        ) : (
          <Landing />
        )
      ) : (
        <Landing />
      ),
    },
    {
      path: '/admin-panel/editors',
      element: isAuthenticated ? (
        isAdmin ? (
          <EditorDashboard />
        ) : (
          <Landing />
        )
      ) : (
        <Landing />
      ),
    },
    {
      path: '/admin-panel/videos',
      element: isAuthenticated ? (
        isAdmin ? (
          <VideosDashboard />
        ) : (
          <Landing />
        )
      ) : (
        <Landing />
      ),
    },
    {
      path: '/admin-panel/requests',
      element: isAuthenticated ? (
        isAdmin ? (
          <EditorDashboard />
        ) : (
          <Landing />
        )
      ) : (
        <Landing />
      ),
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
