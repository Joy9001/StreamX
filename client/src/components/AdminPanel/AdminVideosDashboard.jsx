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
import { Eye, ListFilter, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AdminNav from './AdminNav'

export function Dashboard() {
  const [videoData, setVideoData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadFilters, setUploadFilters] = useState({
    Uploaded: false,
    Uploading: false,
    Failed: false,
    Pending: false,
    None: false,
  })
  const [approvalFilters, setApprovalFilters] = useState({
    Approved: false,
    Pending: false,
    Rejected: false,
    None: false,
  })
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
  }, [userData._id])

  const filteredVideos = videoData.filter((video) => {
    const searchTerm = searchQuery.toLowerCase()
    const matchesSearch =
      video.metaData?.name?.toLowerCase().includes(searchTerm) ||
      video.ownerId?.toLowerCase().includes(searchTerm) ||
      video.editorId?.toLowerCase().includes(searchTerm) ||
      video.ytUploadStatus?.toLowerCase().includes(searchTerm) ||
      video.approvalStatus?.toLowerCase().includes(searchTerm)

    // Check if any upload filters are active
    const uploadFiltersActive = Object.values(uploadFilters).some(
      (value) => value
    )
    const matchesUploadFilter = uploadFiltersActive
      ? uploadFilters[video.ytUploadStatus] ||
        (uploadFilters.None && !video.ytUploadStatus)
      : true

    // Check if any approval filters are active
    const approvalFiltersActive = Object.values(approvalFilters).some(
      (value) => value
    )
    const matchesApprovalFilter = approvalFiltersActive
      ? approvalFilters[video.approvalStatus] ||
        (approvalFilters.None && !video.approvalStatus)
      : true

    return matchesSearch && matchesUploadFilter && matchesApprovalFilter
  })

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
      <AdminNav activePage='Videos' />
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    <DropdownMenuCheckboxItem
                      checked={uploadFilters.None}
                      onCheckedChange={(checked) =>
                        setUploadFilters((prev) => ({
                          ...prev,
                          None: checked,
                        }))
                      }>
                      None
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={uploadFilters.Pending}
                      onCheckedChange={(checked) =>
                        setUploadFilters((prev) => ({
                          ...prev,
                          Pending: checked,
                        }))
                      }>
                      Pending
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={uploadFilters.Uploaded}
                      onCheckedChange={(checked) =>
                        setUploadFilters((prev) => ({
                          ...prev,
                          Uploaded: checked,
                        }))
                      }>
                      Uploaded
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={uploadFilters.Uploading}
                      onCheckedChange={(checked) =>
                        setUploadFilters((prev) => ({
                          ...prev,
                          Uploading: checked,
                        }))
                      }>
                      Uploading
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={uploadFilters.Failed}
                      onCheckedChange={(checked) =>
                        setUploadFilters((prev) => ({
                          ...prev,
                          Failed: checked,
                        }))
                      }>
                      Failed
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuLabel>Filter by approval</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={approvalFilters.None}
                      onCheckedChange={(checked) =>
                        setApprovalFilters((prev) => ({
                          ...prev,
                          None: checked,
                        }))
                      }>
                      None
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={approvalFilters.Approved}
                      onCheckedChange={(checked) =>
                        setApprovalFilters((prev) => ({
                          ...prev,
                          Approved: checked,
                        }))
                      }>
                      Approved
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={approvalFilters.Pending}
                      onCheckedChange={(checked) =>
                        setApprovalFilters((prev) => ({
                          ...prev,
                          Pending: checked,
                        }))
                      }>
                      Pending
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={approvalFilters.Rejected}
                      onCheckedChange={(checked) =>
                        setApprovalFilters((prev) => ({
                          ...prev,
                          Rejected: checked,
                        }))
                      }>
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
                  {filteredVideos.map((video) => (
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
                                  : video.ytUploadStatus === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-800'
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
                        <div className='flex justify-end space-x-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => window.open(video.url, '_blank')}
                            className='text-blue-600 hover:text-blue-800'>
                            <Eye className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
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
                            <Trash2 className='h-4 w-4' />
                          </Button>
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
