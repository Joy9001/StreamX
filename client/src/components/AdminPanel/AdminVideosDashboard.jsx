import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import axios from 'axios'
import {
  Home,
  ListFilter,
  Package2,
  PanelLeft,
  Settings,
  Video,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import logoX from '../../assets/logoX.png'

export function Dashboard() {
  const [videoData, setVideoData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userData = useSelector((state) => state.user.userData)

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/videos/all/Admin/${userData._id}`
        )
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
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-lg'>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-lg text-red-500'>Error: {error}</div>
      </div>
    )
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar - Mobile */}
      <div className='md:hidden'>
        <div className='fixed left-4 top-4 z-40'>
          <Button
            variant='outline'
            size='icon'
            className='fixed left-4 top-4 z-40'>
            <PanelLeft className='h-4 w-4' />
          </Button>
        </div>
        <nav className='fixed h-full w-64 bg-white shadow-sm'>
          <div className='mb-6 flex justify-center gap-1 p-4'>
            <img src={logoX} alt='StreamX Logo' className='h-12 w-auto' />
            <span className='text-3xl font-bold text-black'>StreamX</span>
          </div>
          <Link to='/admin-panel'>
            <Button variant='ghost' className='w-full justify-start gap-2'>
              <Home className='h-4 w-4' />
              Dashboard
            </Button>
          </Link>
          <Link to='/admin-panel/videos'>
            <Button variant='ghost' className='w-full justify-start gap-2'>
              <Video className='h-4 w-4' />
              Videos
            </Button>
          </Link>
          <Link to='/admin-panel/requests'>
            <Button variant='ghost' className='w-full justify-start gap-2'>
              <Package2 className='h-4 w-4' />
              Requests
            </Button>
          </Link>
          <Link to='/admin-panel/owners'>
            <Button variant='ghost' className='w-full justify-start gap-2'>
              <Settings className='h-4 w-4' />
              Owners
            </Button>
          </Link>
          <Link to='/admin-panel/editors'>
            <Button variant='ghost' className='w-full justify-start gap-2'>
              <ListFilter className='h-4 w-4' />
              Editors
            </Button>
          </Link>
        </nav>
      </div>

      {/* Sidebar - Desktop */}
      <div className='hidden md:flex'>
        <div className='fixed h-full w-64 bg-white shadow-sm'>
          <nav className='flex h-full flex-col gap-2 p-4'>
            <div className='mb-6 flex justify-center gap-1'>
              <img src={logoX} alt='StreamX Logo' className='h-12 w-auto' />
              <span className='text-xl font-bold text-black'>StreamX</span>
            </div>
            <Link to='/admin-panel'>
              <Button variant='ghost' className='w-full justify-start gap-2'>
                <Home className='h-4 w-4' />
                Dashboard
              </Button>
            </Link>
            <Link to='/admin-panel/videos'>
              <Button variant='ghost' className='w-full justify-start gap-2'>
                <Video className='h-4 w-4' />
                Videos
              </Button>
            </Link>
            <Link to='/admin-panel/requests'>
              <Button variant='ghost' className='w-full justify-start gap-2'>
                <Package2 className='h-4 w-4' />
                Requests
              </Button>
            </Link>
            <Link to='/admin-panel/owners'>
              <Button variant='ghost' className='w-full justify-start gap-2'>
                <Settings className='h-4 w-4' />
                Owners
              </Button>
            </Link>
            <Link to='/admin-panel/editors'>
              <Button variant='ghost' className='w-full justify-start gap-2'>
                <ListFilter className='h-4 w-4' />
                Editors
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto md:ml-64'>
        <main className='container p-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle>Videos</CardTitle>
              <div className='flex items-center space-x-2'>
                <div className='flex w-full max-w-sm items-center space-x-2'>
                  <Input
                    placeholder='Search videos...'
                    className='h-8 w-[150px] lg:w-[250px]'
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm' className='h-8 w-8 p-0'>
                      <ListFilter className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-[150px]'>
                    <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem>
                      Uploaded
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Uploading
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Failed</DropdownMenuCheckboxItem>
                    <DropdownMenuLabel>Filter by approval</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem>
                      Approved
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Pending</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Rejected
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[200px]'>Title</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Editor</TableHead>
                    <TableHead>Upload Status</TableHead>
                    <TableHead>Approval Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videoData.map((video) => (
                    <TableRow key={video._id}>
                      <TableCell className='font-medium'>
                        {video.metaData?.name || 'Untitled'}
                      </TableCell>
                      <TableCell>{video.ownerId || 'Not Assigned'}</TableCell>
                      <TableCell>{video.editorId || 'Not Assigned'}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            video.ytUploadStatus === 'Uploaded'
                              ? 'bg-green-100 text-green-800'
                              : video.ytUploadStatus === 'Failed'
                                ? 'bg-red-100 text-red-800'
                                : video.ytUploadStatus === 'Uploading'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}>
                          {video.ytUploadStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            video.approvalStatus === 'Approved'
                              ? 'bg-green-100 text-green-800'
                              : video.approvalStatus === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : video.approvalStatus === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}>
                          {video.approvalStatus}
                        </span>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => window.open(video.url, '_blank')}
                            className='text-blue-600 hover:text-blue-800'>
                            View
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Are you sure you want to delete this video?'
                                )
                              ) {
                                try {
                                  axios
                                    .delete(
                                      `http://localhost:3000/api/videos/${video._id}`
                                    )
                                    .then(() => {
                                      setVideoData((videos) =>
                                        videos.filter(
                                          (v) => v._id !== video._id
                                        )
                                      )
                                    })
                                    .catch((err) => {
                                      console.error(
                                        'Error deleting video:',
                                        err
                                      )
                                      alert('Error deleting video')
                                    })
                                } catch (err) {
                                  console.error('Error deleting video:', err)
                                  alert('Error deleting video')
                                }
                              }
                            }}
                            className='text-red-600 hover:text-red-800'>
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
