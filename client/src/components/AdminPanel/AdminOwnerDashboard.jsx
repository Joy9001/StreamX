import axios from 'axios'
import { useEffect, useState } from 'react'
import OwnerModal from './OwnerModal'

import { Pencil, PlusCircle, Search, Trash } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import AdminNav from './AdminNav'

export function Dashboard() {
  const [ownerData, setOwnerData] = useState([])
  const [videosData, setVideosData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentOwner, setCurrentOwner] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch owners data
        const ownersResponse = await axios.get(
          'http://localhost:3000/api/ownerProfile'
        )
        console.log('ownerData', ownersResponse.data)

        // Fetch all videos data
        const videosResponse = await axios.get(
          'http://localhost:3000/api/admin/videos'
        )
        console.log('videosData', videosResponse.data)

        setOwnerData(ownersResponse.data)
        setVideosData(videosResponse.data || [])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate videos count for each owner
  const getOwnerVideosCount = (ownerId) => {
    if (!ownerId || !videosData || videosData.length === 0) return 0

    return videosData.filter((video) => {
      // Check if video.ownerId exists and has _id property
      if (!video.ownerId || !video.ownerId._id) return false

      // Compare as strings to ensure proper comparison
      return video.ownerId._id.toString() === ownerId.toString()
    }).length
  }

  // Calculate storage usage for each owner based on their videos
  const getOwnerStorageUsage = (ownerId) => {
    if (!ownerId || !videosData || videosData.length === 0) return 0

    return videosData
      .filter((video) => {
        // Check if video.ownerId exists and has _id property
        if (!video.ownerId || !video.ownerId._id) return false

        // Compare as strings to ensure proper comparison
        return video.ownerId._id.toString() === ownerId.toString()
      })
      .reduce((total, video) => {
        // Get video size from metaData if available
        const videoSize = video.metaData?.size || 0

        // Convert bytes to KB (1 KB = 1024 bytes)
        return total + videoSize / 1024
      }, 0)
  }

  const handleEditClick = async (owner) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/ownerProfile/${owner.email}`
      )
      // Convert storage limit from KB to GB for the form
      const ownerData = response.data
      setCurrentOwner(ownerData)
      setIsCreating(false)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Error fetching owner data:', err)
      alert('Error fetching owner data. Please try again.')
    }
  }

  const handleAddOwnerClick = () => {
    setCurrentOwner(null)
    setIsCreating(true)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleFormSubmit = async (newOwnerData) => {
    if (isCreating) {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/ownerProfile',
          newOwnerData
        )
        setOwnerData((prevData) => [...prevData, response.data])
        alert('New owner created successfully.')
      } catch (err) {
        console.error('Error creating owner:', err)
        alert('Error creating owner. Please try again.')
      }
    } else {
      try {
        const response = await axios.patch(
          `http://localhost:3000/api/ownerProfile/${currentOwner.email}`,
          newOwnerData
        )
        setOwnerData((prevData) =>
          prevData.map((owner) =>
            owner.email === currentOwner.email ? response.data : owner
          )
        )
        alert('Owner updated successfully.')
      } catch (err) {
        console.error('Error updating owner:', err)
        alert('Error updating owner. Please try again.')
      }
    }
    setIsModalOpen(false)
  }

  const deleteOwner = async (email) => {
    try {
      await axios.delete(`http://localhost:3000/api/ownerProfile/${email}`)
      console.log(`Owner with email ${email} deleted successfully.`)
      setOwnerData((prevData) =>
        prevData.filter((owner) => owner.email !== email)
      )
      alert('Owner deleted successfully.')
    } catch (error) {
      console.error('Error deleting owner:', error)
      alert('Error deleting owner. Please try again.')
    }
  }

  // Helper function to get avatar URL if profile photo is not available
  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
  }

  // Format storage size to human-readable format
  const formatStorage = (sizeInKB) => {
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(2)} KB`
    } else if (sizeInKB < 1024 * 1024) {
      return `${(sizeInKB / 1024).toFixed(2)} MB`
    } else {
      return `${(sizeInKB / (1024 * 1024)).toFixed(2)} GB`
    }
  }

  // Get membership badge color
  const getMembershipColor = (membership) => {
    switch (membership?.toLowerCase()) {
      case 'bronze':
        return 'bg-amber-700'
      case 'silver':
        return 'bg-slate-400'
      case 'gold':
        return 'bg-amber-400'
      case 'platinum':
        return 'bg-cyan-400'
      default:
        return 'bg-slate-600'
    }
  }

  // Filter owners based on search query
  const filteredOwners = ownerData.filter(
    (owner) =>
      owner.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.membership?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='flex h-screen bg-gray-100'>
      <AdminNav activePage='Owners' />

      {/* Main Content */}
      <div className='flex-1 overflow-auto md:ml-64'>
        <header className='sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm'>
          <div className='flex flex-1 items-center gap-4'>
            <div className='relative flex-1 md:max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search owners...'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleAddOwnerClick}>
              <PlusCircle className='mr-2 h-4 w-4' />
              Add Owner
            </Button>
          </div>
        </header>

        <main className='grid gap-4 p-4'>
          {loading ? (
            <div className='flex h-64 items-center justify-center'>
              <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary'></div>
            </div>
          ) : error ? (
            <Card className='bg-red-50'>
              <CardContent className='pt-6'>
                <p className='text-red-600'>Error: {error}</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Owners ({filteredOwners.length})</CardTitle>
                <div className='text-sm text-muted-foreground'>
                  Total Videos: {videosData.length}
                </div>
              </CardHeader>
              <CardContent>
                <div className='relative w-full overflow-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Owner</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Membership</TableHead>
                        <TableHead>Storage Usage</TableHead>
                        <TableHead>Videos</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOwners.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className='py-4 text-center'>
                            No owners found matching your search
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOwners.map((owner) => {
                          // Calculate storage usage for this owner
                          const usedStorage = getOwnerStorageUsage(owner._id)

                          return (
                            <TableRow key={owner.email}>
                              <TableCell>
                                <div className='flex items-center space-x-3'>
                                  <div className='h-10 w-10 flex-shrink-0 overflow-hidden rounded-full'>
                                    <img
                                      src={
                                        owner.profilephoto ||
                                        getAvatarUrl(owner.username)
                                      }
                                      alt={owner.username}
                                      className='h-full w-full object-cover'
                                    />
                                  </div>
                                  <div>
                                    <div className='font-medium'>
                                      {owner.username}
                                    </div>
                                    {owner.bio && (
                                      <div className='text-xs text-muted-foreground'>
                                        {owner.bio}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{owner.email}</TableCell>
                              <TableCell>
                                {owner.membership ? (
                                  <Badge
                                    className={`${getMembershipColor(owner.membership)} text-white`}>
                                    {owner.membership.toUpperCase()}
                                  </Badge>
                                ) : (
                                  <Badge variant='outline'>None</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className='space-y-1'>
                                        <div className='flex items-center justify-between text-xs'>
                                          <span>
                                            {formatStorage(usedStorage)}
                                          </span>
                                          <span>
                                            {formatStorage(
                                              owner.storageLimit || 10240
                                            )}
                                          </span>
                                        </div>
                                        <Progress
                                          value={
                                            (usedStorage /
                                              (owner.storageLimit || 10240)) *
                                            100
                                          }
                                          className='h-2'
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {formatStorage(usedStorage)} used of{' '}
                                        {formatStorage(
                                          owner.storageLimit || 10240
                                        )}{' '}
                                        (
                                        {(
                                          (usedStorage /
                                            (owner.storageLimit || 10240)) *
                                          100
                                        ).toFixed(1)}
                                        %)
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                <Badge variant='outline'>
                                  {getOwnerVideosCount(owner._id)} videos
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className='flex items-center justify-end gap-2'>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          onClick={() => handleEditClick(owner)}
                                          className='h-8 w-8 text-slate-600 hover:text-slate-900'>
                                          <Pencil className='h-4 w-4' />
                                          <span className='sr-only'>Edit</span>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side='left'>
                                        <p>Edit owner</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          onClick={() => {
                                            if (
                                              window.confirm(
                                                'Are you sure you want to delete this owner?'
                                              )
                                            ) {
                                              deleteOwner(owner.email)
                                            }
                                          }}
                                          className='h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600'>
                                          <Trash className='h-4 w-4' />
                                          <span className='sr-only'>
                                            Delete
                                          </span>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side='left'>
                                        <p>Delete owner</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {isModalOpen && (
        <OwnerModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          owner={currentOwner}
          isCreating={isCreating}
        />
      )}
    </div>
  )
}

export default Dashboard
