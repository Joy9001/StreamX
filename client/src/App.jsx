import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Dashboard as EditorDashboard } from './components/AdminPanel/AdminEditorDashboard.jsx'
import { Dashboard as OwnerDashboard } from './components/AdminPanel/AdminOwnerDashboard.jsx'
import AdminPanel from './components/AdminPanel/AdminPanel.jsx'
import AdminRequestsDashboard from './components/AdminPanel/AdminRequestsDashboard.jsx'
import { Dashboard as VideosDashboard } from './components/AdminPanel/AdminVideosDashboard.jsx'
import EditorUi from './components/EditorProfile/EditorUi.jsx'
import GigProfile from './components/GigProfile/GigProfile.jsx'
import HiredEditor from './components/HiredEditor/HiredEditor.jsx'
import Landing from './components/LandingPage/Landing.jsx'
import Profile from './components/OwnerProfile/Profile.jsx'
import Payment from './components/Payments/Payment.jsx'
import RequestApprove from './components/Request&Apporved/Raas.jsx'
import Storage from './components/Storage/Storage.jsx'
import { isEmpty } from './utils/utils.js'

function App() {
  const { isAuthenticated, isLoading } = useAuth0()
  const userData = useSelector((state) => state.user.userData)
  const isAdmin = userData?.user_metadata?.role === 'Admin'
  const [isReady, setIsReady] = useState(false)

  // Wait for authentication to complete before rendering routes
  useEffect(() => {
    if (!isLoading && !isEmpty(userData)) {
      setIsReady(true)
    }
  }, [isLoading, userData])

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
        <Navigate to='/' replace />
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
        <Navigate to='/' replace />
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
        <Navigate to='/' replace />
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
        <Navigate to='/' replace />
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
        <Navigate to='/' replace />
      ),
    },
    {
      path: '/payments',
      element: isAuthenticated ? (
        isAdmin ? (
          <Navigate to='/admin-panel' replace />
        ) : (
          <Payment />
        )
      ) : (
        <Navigate to='/' replace />
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
        <Navigate to='/' replace />
      ),
    },
    {
      path: '/admin-panel',
      element: isAuthenticated ? (
        isAdmin ? (
          <AdminPanel />
        ) : (
          <Navigate to='/' replace />
        )
      ) : (
        <Navigate to='/' replace />
      ),
    },
    {
      path: '/admin-panel/owners',
      element: isAuthenticated ? (
        isAdmin ? (
          <OwnerDashboard />
        ) : (
          <Navigate to='/' replace />
        )
      ) : (
        <Navigate to='/' replace />
      ),
    },
    {
      path: '/admin-panel/editors',
      element: isAuthenticated ? (
        isAdmin ? (
          <EditorDashboard />
        ) : (
          <Navigate to='/' replace />
        )
      ) : (
        <Navigate to='/' replace />
      ),
    },
    {
      path: '/admin-panel/videos',
      element: isAuthenticated ? (
        isAdmin ? (
          <VideosDashboard />
        ) : (
          <Navigate to='/' replace />
        )
      ) : (
        <Navigate to='/' replace />
      ),
    },
    {
      path: '/admin-panel/requests',
      element: isAuthenticated ? (
        isAdmin ? (
          <AdminRequestsDashboard />
        ) : (
          <Navigate to='/' replace />
        )
      ) : (
        <Navigate to='/' replace />
      ),
    },
  ])

  // Show loading state while authentication is being determined
  if (!isReady) {
    return <div>Loading...</div>
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
