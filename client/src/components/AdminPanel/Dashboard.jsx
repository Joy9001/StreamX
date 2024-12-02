import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../modal.jsx'

import {
  Home,
  ListFilter,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const description =
  'An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.'

export function Dashboard() {
  const [editorData, setEditorData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentEditor, setCurrentEditor] = useState(null)
  const [isCreating, setIsCreating] = useState(false) // Differentiate between editing and creating

  useEffect(() => {
    const fetchEditorData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/editorProfile')
        setEditorData(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching editor data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchEditorData()
  }, [])

  const handleEditClick = async (editor) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/editorProfile/${editor.email}`
      )
      setCurrentEditor(response.data) // Set the editor details for the modal
      setIsCreating(false) // Set to false, as we are editing
      setIsModalOpen(true) // Open the modal
    } catch (err) {
      console.error('Error fetching editor data:', err)
      alert('Error fetching editor data. Please try again.')
    }
  }

  const handleAddEditorClick = () => {
    setCurrentEditor(null) // Clear current editor
    setIsCreating(true) // Set to true, as we are creating a new editor
    setIsModalOpen(true) // Open the modal
  }

  const handleModalClose = () => {
    setIsModalOpen(false) // Close the modal
  }

  const handleFormSubmit = async (newEditorData) => {
    if (isCreating) {
      // Logic for creating a new editor
      try {
        const response = await axios.post(
          'http://localhost:3000/editorProfile',
          newEditorData
        )
        setEditorData((prevData) => [...prevData, response.data]) // Update the state with the new editor
        alert('New editor created successfully.')
      } catch (err) {
        console.error('Error creating editor:', err)
        alert('Error creating editor. Please try again.')
      }
    } else {
      // Logic for updating an existing editor
      try {
        const response = await axios.put(
          `http://localhost:3000/editorProfile/${currentEditor.email}`,
          newEditorData
        )
        setEditorData((prevData) =>
          prevData.map((editor) =>
            editor.email === currentEditor.email ? response.data : editor
          )
        ) // Update the specific editor
        alert('Editor updated successfully.')
      } catch (err) {
        console.error('Error updating editor:', err)
        alert('Error updating editor. Please try again.')
      }
    }
    setIsModalOpen(false) // Close the modal after the operation
  }

  const deleteEditor = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:3000/editorProfile/${email}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete editor')
      }

      console.log(`Editor with email ${email} deleted successfully.`)
      // Update the state to remove the deleted editor
      setEditorData((prevData) =>
        prevData.filter((editor) => editor.email !== email)
      )
    } catch (error) {
      console.error('Error deleting editor:', error)
      // Optionally notify the user of the error here
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
        <nav className='flex flex-col items-center gap-4 px-2 py-4'>
          {/* <Link
            href='#'
            className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'>
            <Package2 className='h-4 w-4 transition-all group-hover:scale-110' />
            <span className='sr-only'>Acme Inc</span>
          </Link> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'>
                <Home className='h-5 w-5' />
                <span className='sr-only'>Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Dashboard</TooltipContent>
          </Tooltip>
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className='flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8'>
                <ShoppingCart className='h-5 w-5' />
                <span className='sr-only'>Orders</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Orders</TooltipContent>
          </Tooltip> */}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className='flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8'>
                <Package className='h-5 w-5' />
                <span className='sr-only'>Products</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Products</TooltipContent>
          </Tooltip> */}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'>
                <Users2 className='h-5 w-5' />
                <span className='sr-only'>Customers</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Customers</TooltipContent>
          </Tooltip> */}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'>
                <LineChart className='h-5 w-5' />
                <span className='sr-only'>Analytics</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Analytics</TooltipContent>
          </Tooltip> */}
        </nav>
        <nav className='mt-auto flex flex-col items-center gap-4 px-2 py-4'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'>
                <Settings className='h-5 w-5' />
                <span className='sr-only'>Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <Sheet>
            <SheetTrigger asChild>
              <Button size='icon' variant='outline' className='sm:hidden'>
                <PanelLeft className='h-5 w-5' />
                <span className='sr-only'>Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='sm:max-w-xs'>
              <nav className='grid gap-6 text-lg font-medium'>
                <Link
                  href='#'
                  className='text-primary-foreground group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold md:text-base'>
                  <Package2 className='h-5 w-5 transition-all group-hover:scale-110' />
                  <span className='sr-only'>Acme Inc</span>
                </Link>
                <Link
                  href='#'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'>
                  <Home className='h-5 w-5' />
                  Dashboard
                </Link>
                {/* <Link
                  href='#'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'>
                  <ShoppingCart className='h-5 w-5' />
                  Orders
                </Link> */}
                {/* <Link
                  href='#'
                  className='flex items-center gap-4 px-2.5 text-foreground'>
                  <Package className='h-5 w-5' />
                  Products
                </Link> */}
                {/* <Link
                  href='#'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'>
                  <Users2 className='h-5 w-5' />
                  Customers
                </Link> */}
                {/* <Link
                  href='#'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'>
                  <LineChart className='h-5 w-5' />
                  Settings
                </Link> */}
              </nav>
            </SheetContent>
          </Sheet>
          <div className='relative ml-auto flex-1 md:grow-0'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search...'
              className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]'
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='overflow-hidden rounded-full'></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
          <Tabs defaultValue='all'>
            <div className='flex items-center'>
              <div className='ml-auto flex items-center gap-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm' className='h-7 gap-1'>
                      <ListFilter className='h-3.5 w-3.5' />
                      <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* <Button size='sm' className='h-7 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Add Editor
                  </span>
                </Button> */}
              </div>
            </div>
            <TabsContent value='all'>
              <Card>
                <CardHeader>
                  <CardTitle>Editors</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleAddEditorClick}
                    size='sm'
                    className='mb-4'>
                    <PlusCircle className='h-3.5 w-3.5' />
                    Add Editor
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='hidden w-[100px] sm:table-cell'>
                          <span className='sr-only'>Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Software</TableHead>
                        <TableHead>Specializations</TableHead>
                        <TableHead>
                          <span className='sr-only'>Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editorData.map((editor) => (
                        <TableRow key={editor._id}>
                          <TableCell>
                            <img
                              src={
                                editor.image ||
                                'https://avatar.iran.liara.run/public'
                              }
                              alt={editor.name}
                              className='h-10 w-10'
                            />
                          </TableCell>
                          <TableCell className='font-medium'>
                            {editor.name}
                          </TableCell>
                          <TableCell>{editor.email}</TableCell>
                          <TableCell>{editor.phone}</TableCell>
                          <TableCell>{editor.location || 'N/A'}</TableCell>
                          <TableCell>
                            {Array.isArray(editor.software)
                              ? editor.software.join(', ')
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {Array.isArray(editor.specializations)
                              ? editor.specializations.join(', ')
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup='true'
                                  size='icon'
                                  variant='ghost'>
                                  <span className='sr-only'>Toggle menu</span>
                                  ...
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleEditClick(editor)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteEditor(editor.email)}>
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {isModalOpen && (
                    <Modal
                      currentEditor={currentEditor}
                      onClose={handleModalClose}
                      onSave={handleFormSubmit}
                    />
                  )}
                </CardContent>
                <CardFooter>
                  <div className='text-xs text-muted-foreground'>
                    Showing <strong>{editorData.length}</strong> profiles
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
