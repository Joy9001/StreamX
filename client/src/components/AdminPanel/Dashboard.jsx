import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import AdminNav from './AdminNav'

function Dashboard() {
  const [ownerStats, setOwnerStats] = useState([])
  const [editorStats, setEditorStats] = useState([])
  const [requestStats, setRequestStats] = useState([])
  const [videoStats, setVideoStats] = useState([])
  const [loading, setLoading] = useState({
    owners: true,
    editors: true,
    requests: true,
    videos: true,
  })
  const [error, setError] = useState({
    owners: null,
    editors: null,
    requests: null,
    videos: null,
  })

  // Helper function to extract date from ObjectId
  const getDateFromObjectId = (objectId) => {
    const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Helper function to process registration data
  const processRegistrationData = (data) => {
    const statsByDate = data.reduce((acc, item) => {
      const date = getDateFromObjectId(item._id)
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    return Object.entries(statsByDate)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/ownerProfile`
        )
        const chartData = processRegistrationData(response.data)
        setOwnerStats(chartData)
        setLoading((prev) => ({ ...prev, owners: false }))
      } catch (err) {
        console.error('Error fetching owner data:', err)
        setError((prev) => ({
          ...prev,
          owners: 'Failed to load owner statistics',
        }))
        setLoading((prev) => ({ ...prev, owners: false }))
      }
    }

    const fetchEditorData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/editorGig`
        )
        const chartData = processRegistrationData(response.data)
        setEditorStats(chartData)
        setLoading((prev) => ({ ...prev, editors: false }))
      } catch (err) {
        console.error('Error fetching editor data:', err)
        setError((prev) => ({
          ...prev,
          editors: 'Failed to load editor statistics',
        }))
        setLoading((prev) => ({ ...prev, editors: false }))
      }
    }

    const fetchRequestData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/requests`
        )
        const chartData = processRegistrationData(response.data)
        setRequestStats(chartData)
        setLoading((prev) => ({ ...prev, requests: false }))
      } catch (err) {
        console.error('Error fetching request data:', err)
        setError((prev) => ({
          ...prev,
          requests: 'Failed to load request statistics',
        }))
        setLoading((prev) => ({ ...prev, requests: false }))
      }
    }

    const fetchVideoData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/all-videos`
        )
        const chartData = processRegistrationData(response.data)
        setVideoStats(chartData)
        setLoading((prev) => ({ ...prev, videos: false }))
      } catch (err) {
        console.error('Error fetching video data:', err)
        setError((prev) => ({
          ...prev,
          videos: 'Failed to load video statistics',
        }))
        setLoading((prev) => ({ ...prev, videos: false }))
      }
    }

    fetchOwnerData()
    fetchEditorData()
    fetchRequestData()
    fetchVideoData()
  }, [])

  // Common chart component
  const RegistrationChart = ({ data, title, loading, error, color }) => (
    <div className='ml-32 mt-8 rounded-lg bg-white p-6 shadow-lg'>
      <h2 className='mb-4 text-xl font-semibold'>{title}</h2>

      {loading && <p className='text-gray-600'>Loading chart data...</p>}
      {error && <p className='text-red-500'>{error}</p>}

      {!loading && !error && (
        <div className='h-[400px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' angle={-45} textAnchor='end' height={70} />
              <YAxis
                label={{
                  value: 'Number of Registrations',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' },
                }}
              />
              <Tooltip />
              <Bar dataKey='count' fill={color} name='Registrations' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )

  return (
    <div className='flex h-screen'>
      {/* Sidebar Navigation */}
      <AdminNav />

      {/* Main Content */}
      <div className='flex-1 overflow-y-auto bg-gray-100 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 ml-32 text-3xl font-bold'>Dashboard</h1>

          {/* Owner Registration Chart */}
          <RegistrationChart
            data={ownerStats}
            title='Owner Registrations Over Time'
            loading={loading.owners}
            error={error.owners}
            color='#8884d8'
          />

          {/* Editor Registration Chart */}
          <RegistrationChart
            data={editorStats}
            title='Editor Registrations Over Time'
            loading={loading.editors}
            error={error.editors}
            color='#82ca9d'
          />

          {/* Request Chart */}
          <RegistrationChart
            data={requestStats}
            title='Requests Over Time'
            loading={loading.requests}
            error={error.requests}
            color='#ffc658'
          />

          {/* Video Chart */}
          <RegistrationChart
            data={videoStats}
            title='Videos Uploaded Over Time'
            loading={loading.videos}
            error={error.videos}
            color='#ff7300'
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
