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
import {
  setEditors,
  setEditorsError,
  setEditorsLoading,
  setOwners,
  setOwnersError,
  setOwnersLoading,
} from '@/store/slices/adminSlice'
import axios from 'axios'
import {
  BarChart2,
  Eye,
  Globe,
  ListFilter,
  PieChart,
  Tag,
  Trash2,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  // New state for owner and editor filters
  const [selectedOwnerId, setSelectedOwnerId] = useState(null)
  const [selectedEditorId, setSelectedEditorId] = useState(null)
  const [showStats, setShowStats] = useState(false)

  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userData)
  const { owners, editors } = useSelector((state) => ({
    owners: state.admin.owners,
    editors: state.admin.editors,
  }))

  // Fetch videos, owners and editors data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch videos
        const videosResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/all/Admin/${userData._id}`
        )
        console.log('Videos:', videosResponse.data.videos)
        setVideoData(videosResponse.data.videos)

        // Fetch owners
        dispatch(setOwnersLoading(true))
        const ownersResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/owners`
        )
        dispatch(setOwners(ownersResponse.data.owners))
        dispatch(setOwnersLoading(false))

        // Fetch editors
        dispatch(setEditorsLoading(true))
        const editorsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/editors`
        )
        dispatch(setEditors(editorsResponse.data.editors))
        dispatch(setEditorsLoading(false))

        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message)
        dispatch(setOwnersError(err.message))
        dispatch(setEditorsError(err.message))
        setLoading(false)
      }
    }

    fetchData()
  }, [userData._id, dispatch])

  // Helper functions to get owner and editor info by ID
  const getOwnerInfo = (ownerId) => {
    if (!ownerId) return 'Not Assigned'
    const owner = owners.find((o) => o._id === ownerId)
    return owner ? owner.username : 'Unknown Owner'
  }

  const getEditorInfo = (editorId) => {
    if (!editorId) return 'Not Assigned'
    const editor = editors.find((e) => e._id === editorId)
    return editor ? editor.name : 'Unknown Editor'
  }

  // Helper function to get avatar URL
  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Calculate video statistics by owner and editor
  const calculateStats = () => {
    const ownerStats = {}
    const editorStats = {}
    const tagStats = {}
    const visibilityStats = {}
    const audienceStats = {}

    videoData.forEach((video) => {
      // Count by owner
      const ownerId = video.ownerId || 'unassigned'
      const ownerName = getOwnerInfo(video.ownerId)
      if (!ownerStats[ownerId]) {
        ownerStats[ownerId] = { name: ownerName, count: 0 }
      }
      ownerStats[ownerId].count++

      // Count by editor
      const editorId = video.editorId || 'unassigned'
      const editorName = getEditorInfo(video.editorId)
      if (!editorStats[editorId]) {
        editorStats[editorId] = { name: editorName, count: 0 }
      }
      editorStats[editorId].count++

      // Count by tags
      if (video.ytData?.tags) {
        video.ytData.tags.forEach((tag) => {
          if (!tagStats[tag]) {
            tagStats[tag] = { name: tag, count: 0 }
          }
          tagStats[tag].count++
        })
      }

      // Count by visibility
      const visibility = video.ytData?.visibility || 'Not Set'
      if (!visibilityStats[visibility]) {
        visibilityStats[visibility] = { name: visibility, count: 0 }
      }
      visibilityStats[visibility].count++

      // Count by audience
      const audience = video.ytData?.audience || 'Not Set'
      if (!audienceStats[audience]) {
        audienceStats[audience] = { name: audience, count: 0 }
      }
      audienceStats[audience].count++
    })

    return {
      owners: Object.values(ownerStats).sort((a, b) => b.count - a.count),
      editors: Object.values(editorStats).sort((a, b) => b.count - a.count),
      tags: Object.values(tagStats).sort((a, b) => b.count - a.count),
      visibility: Object.values(visibilityStats).sort(
        (a, b) => b.count - a.count
      ),
      audience: Object.values(audienceStats).sort((a, b) => b.count - a.count),
    }
  }

  const stats = calculateStats()

  const filteredVideos = videoData.filter((video) => {
    const searchTerm = searchQuery.toLowerCase()
    const ownerName = getOwnerInfo(video.ownerId).toLowerCase()
    const editorName = getEditorInfo(video.editorId).toLowerCase()

    const matchesSearch =
      video.metaData?.name?.toLowerCase().includes(searchTerm) ||
      ownerName.includes(searchTerm) ||
      editorName.includes(searchTerm) ||
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

    // Check owner filter
    const matchesOwnerFilter = selectedOwnerId
      ? video.ownerId === selectedOwnerId
      : true

    // Check editor filter
    const matchesEditorFilter = selectedEditorId
      ? video.editorId === selectedEditorId
      : true

    return (
      matchesSearch &&
      matchesUploadFilter &&
      matchesApprovalFilter &&
      matchesOwnerFilter &&
      matchesEditorFilter
    )
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
          {showStats && (
            <Card className='mb-4 shadow-md'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 border-b pb-4'>
                <div className='flex items-center'>
                  <PieChart className='mr-2 h-5 w-5 text-primary' />
                  <CardTitle>Video Analytics Dashboard</CardTitle>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowStats(false)}>
                  Hide Stats
                </Button>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                  {/* Contributors Section */}
                  <Card className='border shadow-sm'>
                    <CardHeader className='bg-slate-50 pb-2 pt-4'>
                      <div className='flex items-center'>
                        <Users className='mr-2 h-4 w-4 text-slate-600' />
                        <CardTitle className='text-base font-medium'>
                          Contributors
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className='p-4'>
                      <div className='space-y-4'>
                        <div>
                          <h4 className='mb-2 text-sm font-medium uppercase tracking-wide text-slate-600'>
                            Top Owners
                          </h4>
                          <div className='space-y-2'>
                            {stats.owners.slice(0, 5).map((owner, index) => (
                              <div
                                key={index}
                                className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                  <span className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary'>
                                    {index + 1}
                                  </span>
                                  <span className='text-sm'>{owner.name}</span>
                                </div>
                                <div className='flex items-center'>
                                  <div className='mr-2 h-2 w-24 overflow-hidden rounded-full bg-slate-100'>
                                    <div
                                      className='h-full rounded-full bg-primary'
                                      style={{
                                        width: `${Math.min(100, (owner.count / Math.max(...stats.owners.map((o) => o.count))) * 100)}%`,
                                      }}
                                    />
                                  </div>
                                  <span className='text-sm font-medium'>
                                    {owner.count}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className='mb-2 text-sm font-medium uppercase tracking-wide text-slate-600'>
                            Top Editors
                          </h4>
                          <div className='space-y-2'>
                            {stats.editors.slice(0, 5).map((editor, index) => (
                              <div
                                key={index}
                                className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                  <span className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600'>
                                    {index + 1}
                                  </span>
                                  <span className='text-sm'>{editor.name}</span>
                                </div>
                                <div className='flex items-center'>
                                  <div className='mr-2 h-2 w-24 overflow-hidden rounded-full bg-slate-100'>
                                    <div
                                      className='h-full rounded-full bg-indigo-500'
                                      style={{
                                        width: `${Math.min(100, (editor.count / Math.max(...stats.editors.map((e) => e.count))) * 100)}%`,
                                      }}
                                    />
                                  </div>
                                  <span className='text-sm font-medium'>
                                    {editor.count}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Metadata Section */}
                  <Card className='border shadow-sm'>
                    <CardHeader className='bg-slate-50 pb-2 pt-4'>
                      <div className='flex items-center'>
                        <Globe className='mr-2 h-4 w-4 text-slate-600' />
                        <CardTitle className='text-base font-medium'>
                          Content Distribution
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className='p-4'>
                      <div className='space-y-4'>
                        <div>
                          <h4 className='mb-2 text-sm font-medium uppercase tracking-wide text-slate-600'>
                            Visibility
                          </h4>
                          <div className='grid grid-cols-2 gap-2'>
                            {stats.visibility.map((item, index) => (
                              <div
                                key={index}
                                className='rounded-lg bg-slate-50 p-3'>
                                <div className='mb-1 flex items-center justify-between'>
                                  <span className='text-sm capitalize'>
                                    {item.name}
                                  </span>
                                  <span className='text-sm font-medium'>
                                    {item.count}
                                  </span>
                                </div>
                                <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-200'>
                                  <div
                                    className='h-full rounded-full bg-emerald-500'
                                    style={{
                                      width: `${Math.min(100, (item.count / videoData.length) * 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className='mb-2 text-sm font-medium uppercase tracking-wide text-slate-600'>
                            Audience
                          </h4>
                          <div className='grid grid-cols-2 gap-2'>
                            {stats.audience.map((item, index) => (
                              <div
                                key={index}
                                className='rounded-lg bg-slate-50 p-3'>
                                <div className='mb-1 flex items-center justify-between'>
                                  <span className='text-sm capitalize'>
                                    {item.name === 'madeForKids'
                                      ? 'Kids'
                                      : item.name}
                                  </span>
                                  <span className='text-sm font-medium'>
                                    {item.count}
                                  </span>
                                </div>
                                <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-200'>
                                  <div
                                    className='h-full rounded-full bg-blue-500'
                                    style={{
                                      width: `${Math.min(100, (item.count / videoData.length) * 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tags Section */}
                  <Card className='border shadow-sm'>
                    <CardHeader className='bg-slate-50 pb-2 pt-4'>
                      <div className='flex items-center'>
                        <Tag className='mr-2 h-4 w-4 text-slate-600' />
                        <CardTitle className='text-base font-medium'>
                          Popular Tags
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className='p-4'>
                      <div className='flex flex-wrap gap-2'>
                        {stats.tags.slice(0, 15).map((tag, index) => (
                          <div
                            key={index}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              index < 3
                                ? 'bg-primary/10 text-primary'
                                : index < 7
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-slate-100 text-slate-700'
                            }`}
                            style={{
                              fontSize: `${Math.max(11, Math.min(14, 11 + (tag.count / Math.max(...stats.tags.slice(0, 15).map((t) => t.count))) * 3))}px`,
                            }}>
                            {tag.name}
                            <span className='ml-1 opacity-70'>{tag.count}</span>
                          </div>
                        ))}
                      </div>

                      <div className='mt-4'>
                        <h4 className='mb-2 text-sm font-medium uppercase tracking-wide text-slate-600'>
                          Top Tags
                        </h4>
                        <div className='space-y-2'>
                          {stats.tags.slice(0, 5).map((tag, index) => (
                            <div
                              key={index}
                              className='flex items-center justify-between'>
                              <div className='flex items-center'>
                                <span className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-medium text-amber-600'>
                                  {index + 1}
                                </span>
                                <span className='text-sm'>{tag.name}</span>
                              </div>
                              <div className='flex items-center'>
                                <div className='mr-2 h-2 w-24 overflow-hidden rounded-full bg-slate-100'>
                                  <div
                                    className='h-full rounded-full bg-amber-500'
                                    style={{
                                      width: `${Math.min(100, (tag.count / Math.max(...stats.tags.map((t) => t.count))) * 100)}%`,
                                    }}
                                  />
                                </div>
                                <span className='text-sm font-medium'>
                                  {tag.count}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary Section */}
                  <Card className='border shadow-sm md:col-span-3'>
                    <CardHeader className='bg-slate-50 pb-2 pt-4'>
                      <div className='flex items-center'>
                        <BarChart2 className='mr-2 h-4 w-4 text-slate-600' />
                        <CardTitle className='text-base font-medium'>
                          Summary
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className='p-4'>
                      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                        <div className='rounded-lg border bg-card p-3'>
                          <div className='mb-1 text-sm font-medium text-muted-foreground'>
                            Total Videos
                          </div>
                          <div className='text-2xl font-bold'>
                            {videoData.length}
                          </div>
                        </div>
                        <div className='rounded-lg border bg-card p-3'>
                          <div className='mb-1 text-sm font-medium text-muted-foreground'>
                            Approved
                          </div>
                          <div className='text-2xl font-bold text-green-600'>
                            {
                              videoData.filter(
                                (v) => v.approvalStatus === 'Approved'
                              ).length
                            }
                          </div>
                        </div>
                        <div className='rounded-lg border bg-card p-3'>
                          <div className='mb-1 text-sm font-medium text-muted-foreground'>
                            Pending
                          </div>
                          <div className='text-2xl font-bold text-amber-600'>
                            {
                              videoData.filter(
                                (v) => v.approvalStatus === 'Pending'
                              ).length
                            }
                          </div>
                        </div>
                        <div className='rounded-lg border bg-card p-3'>
                          <div className='mb-1 text-sm font-medium text-muted-foreground'>
                            Uploaded to YT
                          </div>
                          <div className='text-2xl font-bold text-blue-600'>
                            {
                              videoData.filter(
                                (v) => v.ytUploadStatus === 'Uploaded'
                              ).length
                            }
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='flex items-center space-x-2'>
                <CardTitle>Videos</CardTitle>
                {!showStats && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowStats(true)}
                    className='ml-2'>
                    <BarChart2 className='mr-1 h-4 w-4' />
                    Show Stats
                  </Button>
                )}
              </div>
              <div className='flex items-center space-x-2'>
                <div className='flex w-full max-w-sm items-center space-x-2'>
                  <Input
                    placeholder='Search videos...'
                    className='h-8 w-[150px] lg:w-[250px]'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Owner Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm' className='h-8'>
                      <Users className='mr-1 h-4 w-4' />
                      Owner
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-[200px]'>
                    <DropdownMenuLabel>Filter by Owner</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedOwnerId === null}
                      onCheckedChange={() => setSelectedOwnerId(null)}>
                      All Owners
                    </DropdownMenuCheckboxItem>
                    {owners.map((owner) => (
                      <DropdownMenuCheckboxItem
                        key={owner._id}
                        checked={selectedOwnerId === owner._id}
                        onCheckedChange={() => setSelectedOwnerId(owner._id)}>
                        {owner.username} (
                        {
                          videoData.filter((v) => v.ownerId === owner._id)
                            .length
                        }
                        )
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Editor Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm' className='h-8'>
                      <Users className='mr-1 h-4 w-4' />
                      Editor
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-[200px]'>
                    <DropdownMenuLabel>Filter by Editor</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedEditorId === null}
                      onCheckedChange={() => setSelectedEditorId(null)}>
                      All Editors
                    </DropdownMenuCheckboxItem>
                    {editors.map((editor) => (
                      <DropdownMenuCheckboxItem
                        key={editor._id}
                        checked={selectedEditorId === editor._id}
                        onCheckedChange={() => setSelectedEditorId(editor._id)}>
                        {editor.name} (
                        {
                          videoData.filter((v) => v.editorId === editor._id)
                            .length
                        }
                        )
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Status Filter Dropdown */}
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
              {/* Filter summary */}
              {(selectedOwnerId || selectedEditorId) && (
                <div className='mb-4 rounded-md bg-blue-50 p-2'>
                  <p className='text-sm'>
                    {selectedOwnerId &&
                      `Showing videos by owner: ${getOwnerInfo(selectedOwnerId)}`}
                    {selectedOwnerId && selectedEditorId && ' and '}
                    {selectedEditorId &&
                      `editor: ${getEditorInfo(selectedEditorId)}`}{' '}
                    <Button
                      variant='link'
                      size='sm'
                      className='h-auto p-0 text-blue-600'
                      onClick={() => {
                        setSelectedOwnerId(null)
                        setSelectedEditorId(null)
                      }}>
                      Clear filters
                    </Button>
                  </p>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[200px]'>Title</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Editor</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>YouTube Info</TableHead>
                    <TableHead>Upload Status</TableHead>
                    <TableHead>Approval Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVideos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className='py-4 text-center'>
                        No videos match the current filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVideos.map((video) => (
                      <TableRow key={video._id}>
                        <TableCell className='font-medium'>
                          {video.metaData?.name || 'Untitled'}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            {video.ownerPic ? (
                              <img
                                src={video.ownerPic}
                                alt={getOwnerInfo(video.ownerId)}
                                className='h-6 w-6 rounded-full object-cover'
                              />
                            ) : (
                              <img
                                src={getAvatarUrl(getOwnerInfo(video.ownerId))}
                                alt={getOwnerInfo(video.ownerId)}
                                className='h-6 w-6 rounded-full object-cover'
                              />
                            )}
                            <span>{getOwnerInfo(video.ownerId)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            {video.editorPic ? (
                              <img
                                src={video.editorPic}
                                alt={getEditorInfo(video.editorId)}
                                className='h-6 w-6 rounded-full object-cover'
                              />
                            ) : (
                              <img
                                src={getAvatarUrl(
                                  getEditorInfo(video.editorId)
                                )}
                                alt={getEditorInfo(video.editorId)}
                                className='h-6 w-6 rounded-full object-cover'
                              />
                            )}
                            <span>{getEditorInfo(video.editorId)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {video.metaData?.size
                            ? `${(video.metaData.size / (1024 * 1024)).toFixed(2)} MB`
                            : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {video.ytData ? (
                            <div className='text-xs'>
                              <div>
                                <span className='font-semibold'>
                                  Visibility:
                                </span>{' '}
                                {video.ytData.visibility}
                              </div>
                              <div>
                                <span className='font-semibold'>Audience:</span>{' '}
                                {video.ytData.audience === 'madeForKids'
                                  ? 'Kids'
                                  : video.ytData.audience}
                              </div>
                              {video.ytData.tags &&
                                video.ytData.tags.length > 0 && (
                                  <div className='mt-1 flex flex-wrap gap-1'>
                                    {video.ytData.tags
                                      .slice(0, 3)
                                      .map((tag, idx) => (
                                        <span
                                          key={idx}
                                          className='rounded-full bg-gray-100 px-2 py-0.5 text-xs'>
                                          {tag}
                                        </span>
                                      ))}
                                    {video.ytData.tags.length > 3 && (
                                      <span className='text-gray-500'>
                                        +{video.ytData.tags.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}
                            </div>
                          ) : (
                            <span className='text-gray-500'>Not set</span>
                          )}
                        </TableCell>
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
                        <TableCell>{formatDate(video.createdAt)}</TableCell>
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
                              onClick={() => {}}
                              className='text-red-600 hover:text-red-800'>
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
