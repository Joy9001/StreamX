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
  CheckCircle,
  Clock,
  ListFilter,
  Trash2,
  User,
  Users,
  XCircle,
  Youtube,
} from 'lucide-react'
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
  const [userTypeFilter, setUserTypeFilter] = useState('all') // 'all', 'owner', 'editor'
  const [specificUserSearch, setSpecificUserSearch] = useState('')
  // const userData = useSelector((state) => state.user.userData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/requests`
        )

        const adminRequests = requestsResponse.data.requests.filter(
          (request) => request.to.role === 'Admin'
        )
        console.log('requestsResponse', requestsResponse)
        console.log('adminRequestsResponse', adminRequests)

        setRequestData(requestsResponse.data.requests)
        setAdminRequestData(adminRequests)
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
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/requests/delete/${requestId}`
      )
      // Update the local state to remove the deleted request
      setRequestData((prevData) =>
        prevData.filter((request) => request.request_id !== requestId)
      )
      setAdminRequestData((prevData) =>
        prevData.filter((request) => request.request_id !== requestId)
      )
    } catch (err) {
      console.error('Error deleting request:', err)
      // You might want to show an error message to the user here
    }
  }

  const handleUploadToYoutube = async (request) => {
    try {
      if (!request.video?.url) {
        toast.error('No video URL available')
        return
      }

      // Show loading state
      const loadingToast = toast.loading('Uploading to YouTube...')

      // Make the upload request - no need to send video data for admin role
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/yt/upload/Admin/${request.to.id}/${request.video.id}`
      )

      // Remove loading toast
      toast.dismiss(loadingToast)

      if (response.data.response) {
        toast.success('Successfully uploaded to YouTube!')

        // Update the request data to reflect the upload
        setAdminRequestData((prevData) =>
          prevData.map((req) =>
            req.request_id === request.request_id
              ? {
                  ...req,
                  video: {
                    ...req.video,
                    ytUploadStatus: 'Uploaded',
                    ytData: response.data.response.data,
                  },
                }
              : req
          )
        )
      } else {
        toast.error(response.data.error || 'Failed to upload to YouTube')
      }
    } catch (error) {
      console.error('Error uploading to YouTube:', error)
      toast.error(error.response?.data?.error || 'Error uploading to YouTube')
    }
  }

  const renderYouTubeUploadButton = (request) => {
    console.log('Request:', request)
    const status = request.video?.ytUploadStatus || 'None'
    console.log('Status:', status)

    const statusIcons = {
      None: (
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleUploadToYoutube(request)}
          className='flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 hover:text-red-700'>
          <Youtube className='h-4 w-4' /> Upload to YouTube
        </Button>
      ),
      Pending: (
        <div className='flex items-center gap-2 rounded-md bg-yellow-50 px-3 py-1.5 text-yellow-600'>
          <Clock className='h-4 w-4 animate-pulse' />
          <span className='text-sm font-medium'>YouTube Upload Pending</span>
        </div>
      ),
      Uploading: (
        <div className='flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-blue-600'>
          <Clock className='h-4 w-4 animate-spin' />
          <span className='text-sm font-medium'>Uploading to YouTube</span>
        </div>
      ),
      Uploaded: (
        <div className='flex items-center gap-2 rounded-md bg-green-50 px-3 py-1.5 text-green-600'>
          <CheckCircle className='h-4 w-4' />
          <span className='text-sm font-medium'>Uploaded to YouTube</span>
        </div>
      ),
      Failed: (
        <div className='flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-red-600'>
          <XCircle className='h-4 w-4' />
          <span className='text-sm font-medium'>YouTube Upload Failed</span>
        </div>
      ),
    }

    return statusIcons[status] || statusIcons['None']
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

    // Check user type filter
    let matchesUserTypeFilter = true
    if (userTypeFilter !== 'all') {
      if (userTypeFilter === 'owner') {
        // Filter based on "from" field for owners
        matchesUserTypeFilter = true // Since we don't have role field, we'll keep all
      } else if (userTypeFilter === 'editor') {
        // Filter based on "to" field for editors
        matchesUserTypeFilter = true // Since we don't have role field, we'll keep all
      }
    }

    // Check specific user search - only search in the "from" field (owner)
    let matchesSpecificUser = true
    if (specificUserSearch) {
      const specificSearchTerm = specificUserSearch.toLowerCase()
      matchesSpecificUser = request.from?.name
        ?.toLowerCase()
        .includes(specificSearchTerm)
    }

    return (
      matchesSearch &&
      matchesStatusFilter &&
      matchesUserTypeFilter &&
      matchesSpecificUser
    )
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

    // Check user type filter
    let matchesUserTypeFilter = true
    if (userTypeFilter !== 'all') {
      if (userTypeFilter === 'owner') {
        // Filter based on "from" field for owners
        matchesUserTypeFilter = true // Since we don't have role field, we'll keep all
      } else if (userTypeFilter === 'editor') {
        // Filter based on "to" field for editors
        matchesUserTypeFilter = true // Since we don't have role field, we'll keep all
      }
    }

    // Check specific user search - only search in the "from" field (owner)
    let matchesSpecificUser = true
    if (specificUserSearch) {
      const specificSearchTerm = specificUserSearch.toLowerCase()
      matchesSpecificUser = request.from?.name
        ?.toLowerCase()
        .includes(specificSearchTerm)
    }

    return (
      matchesSearch &&
      matchesStatusFilter &&
      matchesUserTypeFilter &&
      matchesSpecificUser
    )
  })

  // Calculate request counts for specific user search
  const getRequestCountsByUser = () => {
    if (!specificUserSearch) return null

    // Get all requests that match the specific user search
    const matchingRequests = [...requestData, ...adminRequestData].filter(
      (request) => {
        const specificSearchTerm = specificUserSearch.toLowerCase()
        return request.from?.name?.toLowerCase().includes(specificSearchTerm)
      }
    )

    // Count requests by user and status
    const userCounts = {}
    matchingRequests.forEach((request) => {
      const userName = request.from?.name || 'Unknown'
      if (!userCounts[userName]) {
        userCounts[userName] = {
          total: 1,
          pending: request.status === 'pending' ? 1 : 0,
          approved: request.status === 'approved' ? 1 : 0,
          rejected: request.status === 'rejected' ? 1 : 0,
          latestRequest: request.createdAt || null,
        }
      } else {
        userCounts[userName].total++
        if (request.status === 'pending') userCounts[userName].pending++
        if (request.status === 'approved') userCounts[userName].approved++
        if (request.status === 'rejected') userCounts[userName].rejected++

        // Track the latest request date
        if (
          !userCounts[userName].latestRequest ||
          new Date(request.createdAt) >
            new Date(userCounts[userName].latestRequest)
        ) {
          userCounts[userName].latestRequest = request.createdAt
        }
      }
    })

    return userCounts
  }

  const userRequestCounts = getRequestCountsByUser()

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
              <div className='mb-4 flex flex-wrap items-center gap-3'>
                <div className='min-w-[250px] flex-1'>
                  <Input
                    placeholder='Search all requests...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='max-w-[400px]'
                  />
                </div>

                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm'>
                      <ListFilter className='mr-2 h-4 w-4' />
                      Status Filter
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

                {/* User Type Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm'>
                      <Users className='mr-2 h-4 w-4' />
                      User Type:{' '}
                      {userTypeFilter.charAt(0).toUpperCase() +
                        userTypeFilter.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-[200px]'>
                    <DropdownMenuLabel>Filter by User Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={userTypeFilter === 'all'}
                      onCheckedChange={() => setUserTypeFilter('all')}>
                      All Users
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={userTypeFilter === 'owner'}
                      onCheckedChange={() => setUserTypeFilter('owner')}>
                      Owners
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={userTypeFilter === 'editor'}
                      onCheckedChange={() => setUserTypeFilter('editor')}>
                      Editors
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Specific Owner Search */}
                <div className='flex min-w-[250px] items-center gap-2'>
                  <Input
                    placeholder='Search by owner name...'
                    value={specificUserSearch}
                    onChange={(e) => setSpecificUserSearch(e.target.value)}
                    className='flex-1'
                  />
                  <Button variant='ghost' size='icon' className='text-gray-500'>
                    <User className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              {/* Request Count by User Section */}
              {userRequestCounts &&
                Object.keys(userRequestCounts).length > 0 && (
                  <Card className='mb-4 border-blue-200 shadow-md'>
                    <CardHeader className='bg-gradient-to-r from-blue-50 to-blue-100 pb-2'>
                      <CardTitle className='flex items-center text-xl text-blue-800'>
                        <Users className='mr-2 h-5 w-5' />
                        Request Statistics by User
                      </CardTitle>
                      <p className='mt-1 text-sm text-blue-600'>
                        Showing results for &quot;{specificUserSearch}&quot;
                      </p>
                    </CardHeader>
                    <CardContent className='pt-4'>
                      <div className='space-y-4'>
                        {Object.entries(userRequestCounts).map(
                          ([userName, stats]) => (
                            <div
                              key={userName}
                              className='rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50'>
                              <div className='mb-3 flex flex-col justify-between md:flex-row md:items-center'>
                                <div className='flex items-center text-lg font-medium'>
                                  <User className='mr-2 h-4 w-4 text-blue-600' />
                                  {userName}
                                </div>
                                <div className='rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white'>
                                  {stats.total}{' '}
                                  {stats.total === 1 ? 'request' : 'requests'}
                                </div>
                              </div>

                              <div className='mb-3 grid grid-cols-1 gap-3 md:grid-cols-3'>
                                <div className='flex items-center'>
                                  <div className='mr-2 h-3 w-3 rounded-full bg-yellow-400'></div>
                                  <span className='text-sm text-gray-600'>
                                    Pending:{' '}
                                  </span>
                                  <span className='ml-1 font-semibold'>
                                    {stats.pending}
                                  </span>
                                </div>
                                <div className='flex items-center'>
                                  <div className='mr-2 h-3 w-3 rounded-full bg-green-400'></div>
                                  <span className='text-sm text-gray-600'>
                                    Approved:{' '}
                                  </span>
                                  <span className='ml-1 font-semibold'>
                                    {stats.approved}
                                  </span>
                                </div>
                                <div className='flex items-center'>
                                  <div className='mr-2 h-3 w-3 rounded-full bg-red-400'></div>
                                  <span className='text-sm text-gray-600'>
                                    Rejected:{' '}
                                  </span>
                                  <span className='ml-1 font-semibold'>
                                    {stats.rejected}
                                  </span>
                                </div>
                              </div>

                              {stats.latestRequest && (
                                <div className='flex items-center text-xs text-gray-500'>
                                  <Clock className='mr-1 h-3 w-3' />
                                  Latest request:{' '}
                                  {new Date(
                                    stats.latestRequest
                                  ).toLocaleDateString()}{' '}
                                  {new Date(
                                    stats.latestRequest
                                  ).toLocaleTimeString()}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-500 hover:text-blue-700'>
                              {request.video.title || 'View Video'}
                            </a>
                          </TableCell>
                          <TableCell>${request.price}</TableCell>
                          <TableCell>
                            <div className='flex items-center'>
                              {request.status === 'pending' && (
                                <div className='flex items-center gap-1.5 rounded-full bg-yellow-100 px-2.5 py-1 text-yellow-700'>
                                  <Clock className='h-3.5 w-3.5' />
                                  <span className='text-xs font-medium'>
                                    Pending
                                  </span>
                                </div>
                              )}
                              {request.status === 'approved' && (
                                <div className='flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-green-700'>
                                  <CheckCircle className='h-3.5 w-3.5' />
                                  <span className='text-xs font-medium'>
                                    Approved
                                  </span>
                                </div>
                              )}
                              {request.status === 'rejected' && (
                                <div className='flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-red-700'>
                                  <XCircle className='h-3.5 w-3.5' />
                                  <span className='text-xs font-medium'>
                                    Rejected
                                  </span>
                                </div>
                              )}
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
                                if (
                                  window.confirm(
                                    'Are you sure you want to delete this request?'
                                  )
                                ) {
                                  handleDelete(request.request_id)
                                }
                              }}
                              className='rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700'>
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
                <div className='mb-4 flex flex-wrap items-center gap-3'>
                  <div className='min-w-[250px] flex-1'>
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
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-500 hover:text-blue-700'>
                                {request.video.title || 'View Video'}
                              </a>
                            </TableCell>
                            <TableCell>${request.price}</TableCell>
                            <TableCell>
                              <div className='flex items-center'>
                                {request.status === 'pending' && (
                                  <div className='flex items-center gap-1.5 rounded-full bg-yellow-100 px-2.5 py-1 text-yellow-700'>
                                    <Clock className='h-3.5 w-3.5' />
                                    <span className='text-xs font-medium'>
                                      Pending
                                    </span>
                                  </div>
                                )}
                                {request.status === 'approved' && (
                                  <div className='flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-green-700'>
                                    <CheckCircle className='h-3.5 w-3.5' />
                                    <span className='text-xs font-medium'>
                                      Approved
                                    </span>
                                  </div>
                                )}
                                {request.status === 'rejected' && (
                                  <div className='flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-red-700'>
                                    <XCircle className='h-3.5 w-3.5' />
                                    <span className='text-xs font-medium'>
                                      Rejected
                                    </span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(request.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className='flex gap-2'>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        'Are you sure you want to delete this request?'
                                      )
                                    ) {
                                      handleDelete(request.request_id)
                                    }
                                  }}
                                  className='rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700'>
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                                {renderYouTubeUploadButton(request)}
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
