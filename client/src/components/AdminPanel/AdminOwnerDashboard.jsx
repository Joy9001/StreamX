import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import OwnerModal from './OwnerModal'

import {
  Home,
  ListFilter,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  Video,
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

export function Dashboard() {
  const [ownerData, setOwnerData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentOwner, setCurrentOwner] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/ownerProfile')
        setOwnerData(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching owner data:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchOwnerData()
  }, [])

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
      const response = await fetch(
        `http://localhost:3000/api/ownerProfile/${email}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete owner')
      }

      console.log(`Owner with email ${email} deleted successfully.`)
      setOwnerData((prevData) =>
        prevData.filter((owner) => owner.email !== email)
      )
    } catch (error) {
      console.error('Error deleting owner:', error)
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
      <div className="flex-1 overflow-auto md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search owners..."
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
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleAddOwnerClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Owner
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
                <CardTitle>Owners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>YT Channel</TableHead>
                        <TableHead>Storage Limit</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ownerData.map((owner) => (
                        <TableRow key={owner.email}>
                          <TableCell>{owner.username}</TableCell>
                          <TableCell>{owner.email}</TableCell>
                          <TableCell>{owner.YTchannelname || 'N/A'}</TableCell>
                          <TableCell>{owner.storageLimit ? `${owner.storageLimit / 1024}GB` : '10GB'}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(owner)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteOwner(owner.email)}
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
