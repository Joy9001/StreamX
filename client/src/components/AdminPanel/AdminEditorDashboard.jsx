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

import logoX from '../../assets/logoX.png'

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Mobile */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40">
              <PanelLeft className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <nav className="flex h-full flex-col gap-2 bg-white p-4">
              <div className="mb-6 flex justify-center gap-1">
                <img src={logoX} alt="StreamX Logo" className="h-12 w-auto" />
                <span className="text-3xl font-bold text-black">StreamX</span>
              </div>
              <Link to="/AdminPanel">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
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
          </SheetContent>
        </Sheet>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex">
        <div className="fixed h-full w-64 bg-white shadow-sm">
          <nav className="flex h-full flex-col gap-2 p-4">
            <div className="mb-6 flex justify-center gap-1">
              <img src={logoX} alt="StreamX Logo" className="h-12 w-auto" />
              <span className="text-xl font-bold text-black">StreamX</span>
            </div>
            <Link to="/AdminPanel">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Dashboard
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
      <div className="flex-1 overflow-auto md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search editors..."
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ListFilter className="h-4 w-4" />
                  <span className="sr-only">Toggle filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  In stock
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Pre-order</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Out of stock</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleAddEditorClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Editor
            </Button>
          </div>
        </header>

        <main className="grid gap-4 p-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Editors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Languages</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editorData.map((editor) => (
                        <TableRow key={editor.email}>
                          <TableCell>{editor.name}</TableCell>
                          <TableCell>{editor.email}</TableCell>
                          <TableCell>
                            {editor.languages ? editor.languages.join(', ') : 'N/A'}
                          </TableCell>
                          <TableCell>{editor.experience}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(editor)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteEditor(editor.email)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
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
        <Modal
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
