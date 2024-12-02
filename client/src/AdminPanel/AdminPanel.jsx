import { TooltipProvider } from '@radix-ui/react-tooltip'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Dashboard } from './Dashboard'

function AdminPanel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const username = searchParams.get('username')
  const password = searchParams.get('password')

  useEffect(() => {
    if (username !== 'admin' || password !== 'admin') {
      navigate('/')
    }
  })

  return (
    <>
      <TooltipProvider>
        <Dashboard />
      </TooltipProvider>
    </>
  )
}

export default AdminPanel
