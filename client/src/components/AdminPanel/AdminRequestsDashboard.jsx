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
import { CheckCircle, Clock, ListFilter, Trash2, XCircle, Youtube } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
// import { useSelector } from 'react-redux'
import AdminNav from './AdminNav'

export function AdminRequestsDashboard() {
  const [requestData, setRequestData] = useState([])
  const [adminRequestData, setAdminRequestData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [adminSearchQuery, setAdminSearchQuery] = useState('')
  const [statusFilters, setStatusFilters] = useState({
    pending: false,
    approved: false,
    rejected: false,
  })
  // const userData = useSelector((state) => state.user.userData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsResponse, adminRequestsResponse] = await Promise.all([
          axios.get('http://localhost:3000/requests/all'),
          axios.get('http://localhost:3000/requests/admin')
        ]);
        
        setRequestData(requestsResponse.data.requests)
        setAdminRequestData(adminRequestsResponse.data.requests)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching request data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (requestId) => {
    try {
      await axios.delete(`http://localhost:3000/requests/delete/${requestId}`)
      // Update the local state to remove the deleted request
      setRequestData((prevData) => prevData.filter((request) => request.request_id !== requestId))
      setAdminRequestData((prevData) => prevData.filter((request) => request.request_id !== requestId))
    } catch (err) {
      console.error('Error deleting request:', err)
      // You might want to show an error message to the user here
    }
  }

  const handleUploadToYoutube = async (request) => {
    try {
      if (!request.video?.url) {
        alert('No video URL available')
        return
      }

      // Show loading state
      const loadingToast = toast.loading('Uploading to YouTube...')

      const response = await axios.post(`http://localhost:3000/requests/${request.request_id}/upload-youtube`, {
        videoUrl: request.video.url,
        title: request.video.title || 'Uploaded Video',
        description: request.description || 'Video uploaded through admin dashboard'
      })

      // Remove loading toast and show success/error
      toast.dismiss(loadingToast)
      
      if (response.data.success) {
        toast.success('Successfully uploaded to YouTube!')
        
        // Update the request data to reflect the upload
        setAdminRequestData(prevData => 
          prevData.map(req => 
            req.request_id === request.request_id 
              ? { ...req, youtubeUrl: response.data.youtubeUrl }
              : req
          )
        )
      } else {
        toast.error('Failed to upload to YouTube')
      }
    } catch (error) {
      console.error('Error uploading to YouTube:', error)
      toast.error(error.response?.data?.message || 'Error uploading to YouTube')
    }
  }

  const filteredRequests = requestData.filter((request) => {
    const searchTerm = searchQuery.toLowerCase()
    const matchesSearch =
      request.description?.toLowerCase().includes(searchTerm) ||
      request.from?.name?.toLowerCase().includes(searchTerm) ||
      request.to?.name?.toLowerCase().includes(searchTerm) ||
      request.status?.toLowerCase().includes(searchTerm)

    // Check if any status filters are active
    const statusFiltersActive = Object.values(statusFilters).some(
      (value) => value
    )
    const matchesStatusFilter = statusFiltersActive
      ? statusFilters[request.status]
      : true

    return matchesSearch && matchesStatusFilter
  })

  const filteredAdminRequests = adminRequestData.filter((request) => {
    const searchTerm = adminSearchQuery.toLowerCase()
    const matchesSearch =
      request.description?.toLowerCase().includes(searchTerm) ||
      request.from?.name?.toLowerCase().includes(searchTerm) ||
      request.to?.name?.toLowerCase().includes(searchTerm) ||
      request.status?.toLowerCase().includes(searchTerm)

    // Check if any status filters are active
    const statusFiltersActive = Object.values(statusFilters).some(
      (value) => value
    )
    const matchesStatusFilter = statusFiltersActive
      ? statusFilters[request.status]
      : true

    return matchesSearch && matchesStatusFilter
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='flex h-screen bg-gray-100'>
      <AdminNav activePage='Requests' />
      <div className='flex-1 overflow-auto md:ml-64'>
        <div className='flex-1'>
          <div className='flex-1 space-y-4 p-8 pt-6'>
            <div className='flex items-center justify-between space-y-2'>
              <h2 className='text-3xl font-bold tracking-tight'>
                Requests Dashboard
              </h2>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='flex-1'>
                  <Input
                    placeholder='Search all requests...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='max-w-[400px]'
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm' className='ml-auto'>
                      <ListFilter className='mr-2 h-4 w-4' />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-[200px]'>
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.keys(statusFilters).map((status) => (
                      <DropdownMenuCheckboxItem
                        key={status}
                        checked={statusFilters[status]}
                        onCheckedChange={(value) =>
                          setStatusFilters((prev) => ({
                            ...prev,
                            [status]: value,
                          }))
                        }>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* All Requests Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Video</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.request_id}>
                          <TableCell>{request.description}</TableCell>
                          <TableCell>{request.from.name}</TableCell>
                          <TableCell>{request.to.name}</TableCell>
                          <TableCell>
                            <a 
                              href={request.video.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              {request.video.title || 'View Video'}
                            </a>
                          </TableCell>
                          <TableCell>${request.price}</TableCell>
                          <TableCell>
                            <div className='flex items-center'>
                              {request.status === 'pending' && (
                                <Clock className='mr-2 h-4 w-4 text-yellow-500' />
                              )}
                              {request.status === 'approved' && (
                                <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                              )}
                              {request.status === 'rejected' && (
                                <XCircle className='mr-2 h-4 w-4 text-red-500' />
                              )}
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant='ghost' 
                              size='icon'
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this request?')) {
                                  handleDelete(request.request_id)
                                }
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Admin Requests Table */}
              <div className='mt-8'>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex-1'>
                    <Input
                      placeholder='Search admin requests...'
                      value={adminSearchQuery}
                      onChange={(e) => setAdminSearchQuery(e.target.value)}
                      className='max-w-[400px]'
                    />
                  </div>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Requests to Admin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To (Admin)</TableHead>
                          <TableHead>Video</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAdminRequests.map((request) => (
                          <TableRow key={request.request_id}>
                            <TableCell>{request.description}</TableCell>
                            <TableCell>{request.from.name}</TableCell>
                            <TableCell>{request.to.name}</TableCell>
                            <TableCell>
                              <a 
                                href={request.video.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                              >
                                {request.video.title || 'View Video'}
                              </a>
                            </TableCell>
                            <TableCell>${request.price}</TableCell>
                            <TableCell>
                              <div className='flex items-center'>
                                {request.status === 'pending' && (
                                  <Clock className='mr-2 h-4 w-4 text-yellow-500' />
                                )}
                                {request.status === 'approved' && (
                                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                                )}
                                {request.status === 'rejected' && (
                                  <XCircle className='mr-2 h-4 w-4 text-red-500' />
                                )}
                                {request.status.charAt(0).toUpperCase() +
                                  request.status.slice(1)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(request.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant='ghost' 
                                  size='icon'
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this request?')) {
                                      handleDelete(request.request_id)
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleUploadToYoutube(request)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title="Upload to YouTube"
                                >
                                  <Youtube className='h-4 w-4' />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminRequestsDashboard
