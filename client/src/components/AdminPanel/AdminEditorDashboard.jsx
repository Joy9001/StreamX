import axios from 'axios'
import { useEffect, useState } from 'react'
import EditorModal from './EditorModal'

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

export const description =
  'An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.'

export function Dashboard() {
  const [editorData, setEditorData] = useState([])
  const [videosData, setVideosData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentEditor, setCurrentEditor] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch editors data
        const editorsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/editorGig`
        )
        console.log('editorGigData', editorsResponse.data)

        // Fetch all videos data
        const videosResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/videos`
        )
        console.log('videosData', videosResponse.data)

        setEditorData(editorsResponse.data)
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

  // Calculate videos count for each editor
  const getEditorVideosCount = (editorId) => {
    if (!editorId || !videosData || videosData.length === 0) return 0

    return videosData.filter((video) => {
      // Check if video.editorId exists and has _id property
      if (!video.editorId || !video.editorId._id) return false

      // Compare as strings to ensure proper comparison
      return video.editorId._id.toString() === editorId.toString()
    }).length
  }

  // Calculate storage usage for each editor based on their videos
  const getEditorStorageUsage = (editorId) => {
    if (!editorId || !videosData || videosData.length === 0) return 0

    return videosData
      .filter((video) => {
        // Check if video.editorId exists and has _id property
        if (!video.editorId || !video.editorId._id) return false

        // Compare as strings to ensure proper comparison
        return video.editorId._id.toString() === editorId.toString()
      })
      .reduce((total, video) => {
        // Get video size from metaData if available
        const videoSize = video.metaData?.size || 0

        // Convert bytes to KB (1 KB = 1024 bytes)
        return total + videoSize / 1024
      }, 0)
  }

  const handleEditClick = async (editor) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/editorProfile/${editor.email}`
      )
      setCurrentEditor(response.data)
      setIsCreating(false)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Error fetching editor data:', err)
      alert('Error fetching editor data. Please try again.')
    }
  }

  const handleAddEditorClick = () => {
    setCurrentEditor(null)
    setIsCreating(true)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleFormSubmit = async (newEditorData) => {
    if (isCreating) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/editorProfile`,
          newEditorData
        )
        setEditorData((prevData) => [...prevData, response.data])
        alert('New editor created successfully.')
      } catch (err) {
        console.error('Error creating editor:', err)
        alert('Error creating editor. Please try again.')
      }
    } else {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/editorProfile/${currentEditor.email}`,
          newEditorData
        )
        setEditorData((prevData) =>
          prevData.map((editor) =>
            editor.email === currentEditor.email ? response.data : editor
          )
        )
        alert('Editor updated successfully.')
      } catch (err) {
        console.error('Error updating editor:', err)
        alert('Error updating editor. Please try again.')
      }
    }
    setIsModalOpen(false)
  }

  const deleteEditor = async (email) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/editorProfile/${email}`
      )
      console.log(`Editor with email ${email} deleted successfully.`)
      setEditorData((prevData) =>
        prevData.filter((editor) => editor.email !== email)
      )
      alert('Editor deleted successfully.')
    } catch (error) {
      console.error('Error deleting editor:', error)
      alert('Error deleting editor. Please try again.')
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

  // Filter editors based on search query
  const filteredEditors = editorData.filter(
    (editor) =>
      editor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      editor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      editor.languages?.some((lang) =>
        lang.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (editor.experience && editor.experience.toString().includes(searchQuery))
  )

  return (
    <div className='flex h-screen bg-gray-100'>
      <AdminNav activePage='Editors' />
      {/* Main Content */}
      <div className='flex-1 overflow-auto md:ml-64'>
        <header className='sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm'>
          <div className='flex flex-1 items-center gap-4'>
            <div className='relative flex-1 md:max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search editors...'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleAddEditorClick}>
              <PlusCircle className='mr-2 h-4 w-4' />
              Add Editor
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
                <CardTitle>Editors ({filteredEditors.length})</CardTitle>
                <div className='text-sm text-muted-foreground'>
                  Total Videos: {videosData.length}
                </div>
              </CardHeader>
              <CardContent>
                <div className='relative w-full overflow-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Languages</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Storage Usage</TableHead>
                        <TableHead>Videos</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEditors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className='py-4 text-center'>
                            No editors found matching your search
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEditors.map((editor) => {
                          // Calculate storage usage for this editor
                          const usedStorage = getEditorStorageUsage(editor._id)

                          return (
                            <TableRow key={editor.email}>
                              <TableCell>
                                <div className='flex items-center space-x-3'>
                                  <div className='h-10 w-10 flex-shrink-0 overflow-hidden rounded-full'>
                                    <img
                                      src={
                                        editor.profilePhoto ||
                                        getAvatarUrl(editor.name)
                                      }
                                      alt={editor.name}
                                      className='h-full w-full object-cover'
                                    />
                                  </div>
                                  <div className='font-medium'>
                                    {editor.name}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{editor.email}</TableCell>
                              <TableCell>
                                {editor.languages
                                  ? editor.languages.map((lang, index) => (
                                      <Badge
                                        key={index}
                                        variant='outline'
                                        className='mr-1'>
                                        {lang}
                                      </Badge>
                                    ))
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>{editor.experience}</TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className='space-y-1'>
                                        <div className='flex items-center justify-between text-xs'>
                                          <span>
                                            {formatStorage(usedStorage)}
                                          </span>
                                          <span>{formatStorage(10240)}</span>
                                        </div>
                                        <Progress
                                          value={(usedStorage / 10240) * 100}
                                          className='h-2'
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {formatStorage(usedStorage)} used of{' '}
                                        {formatStorage(10240)} (
                                        {((usedStorage / 10240) * 100).toFixed(
                                          1
                                        )}
                                        %)
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                <Badge variant='outline'>
                                  {getEditorVideosCount(editor._id)} videos
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
                                          onClick={() =>
                                            handleEditClick(editor)
                                          }
                                          className='h-8 w-8 text-slate-600 hover:text-slate-900'>
                                          <Pencil className='h-4 w-4' />
                                          <span className='sr-only'>Edit</span>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side='left'>
                                        <p>Edit editor</p>
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
                                                'Are you sure you want to delete this editor?'
                                              )
                                            ) {
                                              deleteEditor(editor.email)
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
                                        <p>Delete editor</p>
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

      {/* Modal for Add/Edit Editor */}
      {isModalOpen && (
        <EditorModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          editor={currentEditor}
          isCreating={isCreating}
        />
      )}
    </div>
  )
}
