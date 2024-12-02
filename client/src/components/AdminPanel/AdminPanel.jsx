import { TooltipProvider } from '@radix-ui/react-tooltip'
import { useEffect } from 'react'
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom'
import { Dashboard as EditorDashboard } from './AdminEditorDashboard'
import { Dashboard as OwnerDashboard } from './AdminOwnerDashboard'

function AdminPanel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const username = searchParams.get('username')
  const password = searchParams.get('password')

  // useEffect(() => {
  //   if (username !== 'admin' || password !== 'admin') {
  //     navigate('/')
  //   }
  // })

  return (
    <>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<EditorDashboard />} />
          <Route path="/editors" element={<EditorDashboard />} />
          <Route path="/owners" element={<OwnerDashboard />} />
          <Route path="/requests" element={<EditorDashboard />} />
        </Routes>
      </TooltipProvider>
    </>
  )
}

export default AdminPanel
