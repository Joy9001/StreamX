import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package2,
  Settings,
  ListFilter,
  Video,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import logoX from '../../assets/logoX.png'

export function Dashboard() {
  const [videoData, setVideoData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/videos/all')
        setVideoData(response.data.videos)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching video data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchVideoData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden w-64 border-r border-gray-200 bg-white md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link to="/AdminPanel" className="flex items-center gap-2">
              <img src={logoX} alt="StreamX Logo" className="h-8 w-8" />
              <span className="font-semibold">StreamX Admin</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            <Link to="/AdminPanel/videos">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Video className="h-4 w-4" />
                Videos
              </Button>
            </Link>
            <Link to="/AdminPanel/requests">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Package2 className="h-4 w-4" />
                Requests
              </Button>
            </Link>
            <Link to="/AdminPanel/owners">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" />
                Owners
              </Button>
            </Link>
            <Link to="/AdminPanel/editors">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <ListFilter className="h-4 w-4" />
                Editors
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Videos</h2>
        </div>

        <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold tracking-tight">
                Video Management Dashboard
              </h2>
              <p className="text-muted-foreground">
                Here's a list of all videos in the system
              </p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Editor</TableHead>
                <TableHead>Upload Status</TableHead>
                <TableHead>Approval Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videoData.map((video) => (
                <TableRow key={video._id}>
                  <TableCell>{video.metaData?.name || 'Untitled'}</TableCell>
                  <TableCell>{video.ownerId}</TableCell>
                  <TableCell>{video.editorId || 'Not Assigned'}</TableCell>
                  <TableCell>
                    <span className={`capitalize ${
                      video.ytUploadStatus === 'Uploaded' ? 'text-green-600' :
                      video.ytUploadStatus === 'Failed' ? 'text-red-600' :
                      video.ytUploadStatus === 'Uploading' ? 'text-blue-600' :
                      'text-gray-600'
                    }`}>
                      {video.ytUploadStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`capitalize ${
                      video.approvalStatus === 'Approved' ? 'text-green-600' :
                      video.approvalStatus === 'Rejected' ? 'text-red-600' :
                      video.approvalStatus === 'Pending' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {video.approvalStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(video.url, '_blank')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this video?')) {
                            try {
                              axios.delete(`http://localhost:3000/api/videos/${video._id}`)
                                .then(() => {
                                  setVideoData(videos => videos.filter(v => v._id !== video._id))
                                })
                                .catch((err) => {
                                  console.error('Error deleting video:', err)
                                  alert('Error deleting video')
                                })
                            } catch (err) {
                              console.error('Error deleting video:', err)
                              alert('Error deleting video')
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
