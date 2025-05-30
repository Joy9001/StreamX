import { TooltipProvider } from '@radix-ui/react-tooltip'
import { useEffect } from 'react'
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import { Dashboard as EditorDashboard } from './AdminEditorDashboard'
import { Dashboard as OwnerDashboard } from './AdminOwnerDashboard'
import { Dashboard as VideosDashboard } from './AdminVideosDashboard'
import Dashboard from './Dashboard'

function AdminPanel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('tab') === 'owners') {
      navigate('/admin-panel/owners')
    }
  }, [searchParams, navigate])

  return (
    <div className='flex h-screen'>
      <div className='flex-1 overflow-auto'>
        <TooltipProvider>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/videos' element={<VideosDashboard />} />
            <Route path='/editors' element={<EditorDashboard />} />
            <Route path='/owners' element={<OwnerDashboard />} />
            <Route path='/requests' element={<EditorDashboard />} />
          </Routes>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default AdminPanel
