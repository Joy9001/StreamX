import { setDrawerOpen } from '@/store/slices/uiSlice'
import { setAllVideos, setRecentVideos } from '@/store/slices/videoSlice'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function ContentTableRowOptions({ video }) {
  const dispatch = useDispatch()
  const recentVideos = useSelector((state) => state.video.recentVideos)
  const userData = useSelector((state) => state.user.userData)
  const allVideos = useSelector((state) => state.video.allVideos)
  const [accessToken, setAccessToken] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hiredEditors, setHiredEditors] = useState([])
  const [hiredByOwners, setHiredByOwners] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [requestForm, setRequestForm] = useState({
    description: '',
    price: 0,
  })
  const [showRequestForm, setShowRequestForm] = useState(false)
  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const token = await getAccessTokenSilently()
        setAccessToken(token)
      } catch (error) {
        console.error('Error fetching access token:', error)
      }
    }
    fetchAccessToken()
  }, [getAccessTokenSilently])

  async function handleDelete() {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/videos/delete/${userData.user_metadata.role}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
          data: {
            id: video._id,
            userId: userData._id,
          },
        }
      )
      console.log(res)
      dispatch(
        setRecentVideos(
          recentVideos.filter((recentVideo) => recentVideo._id !== video._id)
        )
      )
      dispatch(
        setAllVideos(allVideos.filter((allVideo) => allVideo._id !== video._id))
      )
      alert(res.data.message)
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Failed to delete video!')
    } finally {
      dispatch(setDrawerOpen(false))
    }
  }

  async function handleAssignEditor() {
    console.log('Assigning editor...')
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/hired-editors/${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      console.log('Fetched hired editors:', response)
      setHiredEditors(response.data)
      setIsModalOpen(true)
      setShowRequestForm(false)
    } catch (error) {
      console.error('Error fetching hired editors:', error)
    }
  }

  async function handleRequestOwner() {
    console.log('Getting hired-by owners...')
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/editorProfile/hiredby/${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      console.log('Fetched hired-by owners:', response)
      setHiredByOwners(response.data)
      setIsModalOpen(true)
      setShowRequestForm(false)
    } catch (error) {
      console.error('Error fetching hired-by owners:', error)
    }
  }

  // async function handleRevokeOwner() {}

  // async function handleRevokeEditor() {}

  function handleSelectUser(user) {
    setSelectedUser(user)
    setShowRequestForm(true)
    setRequestForm({
      description: `${userData.user_metadata.role === 'Owner' ? 'Request to edit video' : 'Request for ownership of video'} ${video.metaData.name}`,
      price: 0,
    })
  }

  function handleRequestFormChange(e) {
    const { name, value } = e.target
    setRequestForm({
      ...requestForm,
      [name]: name === 'price' ? parseFloat(value) : value,
    })
  }

  async function handleSubmitRequest(e) {
    e.preventDefault()
    if (!selectedUser) return

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/requests/create`,
        {
          to_id: selectedUser._id,
          video_id: video._id,
          from_id: userData._id,
          description: requestForm.description,
          price: requestForm.price,
          status: 'pending',
          requesterKind: userData.user_metadata.role
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      console.log('Request created successfully')
      setIsModalOpen(false)
      setShowRequestForm(false)
      setSelectedUser(null)
      alert('Request sent successfully!')
    } catch (error) {
      console.error('Error creating request:', error)
      alert('Failed to send request: ' + error.message)
    }
  }

  let option1
  if (userData.user_metadata.role === 'Owner') {
    if (video?.editor) {
      option1 = ''
    } else {
      option1 = 'Assign Editor'
    }
  } else {
    if (video?.owner) {
      option1 = ''
    } else {
      option1 = 'Request Owner'
    }
  }

  let option1func
  if (userData.user_metadata.role === 'Owner') {
    if (video?.editor) {
      option1func = null
    } else {
      option1func = handleAssignEditor
    }
  } else {
    if (video?.owner) {
      option1func = null
    } else {
      option1func = handleRequestOwner
    }
  }

  return (
    <>
      <div className='dropdown dropdown-end'>
        <div
          tabIndex={0}
          role='button'
          className='btn btn-circle btn-sm m-1 border-none bg-transparent shadow-none'>
          <svg
            viewBox='0 0 16 16'
            xmlns='http://www.w3.org/2000/svg'
            fill='#000000'
            className='bi bi-three-dots-vertical h-4 w-4'>
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              {' '}
              <path d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'></path>{' '}
            </g>
          </svg>
        </div>
        <ul
          tabIndex={0}
          className='menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 font-semibold shadow'>
          {option1func && (
            <li onClick={option1func}>
              <a>{option1}</a>
            </li>
          )}
          <hr className='my-1 border-neutral-200' />
          <li className='*:text-red-500' onClick={handleDelete}>
            <a>Delete</a>
          </li>
        </ul>
      </div>
      {/* Hired Editors Modal */}
      <dialog
        id='hired_editors_modal'
        className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className='modal-box'>
          {!showRequestForm ? (
            <>
              <h3 className='mb-4 text-lg font-bold'>
                {userData.user_metadata.role === 'Owner'
                  ? 'Assign Editor'
                  : 'View Hired By Owners'}
              </h3>
              <div className='overflow-x-auto'>
                {userData?.user_metadata?.role === 'Owner' ? (
                  hiredEditors.length > 0 ? (
                    <table className='table'>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hiredEditors.map((editor) => (
                          <tr key={editor._id}>
                            <td>{editor.name}</td>
                            <td>{editor.email}</td>
                            <td>
                              <button
                                className='btn btn-primary btn-sm'
                                onClick={() => handleSelectUser(editor)}>
                                Select
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className='py-4 text-center'>No hired editors found</p>
                  )
                ) : hiredByOwners.length > 0 ? (
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hiredByOwners.map((owner) => (
                        <tr key={owner._id}>
                          <td>{owner.username}</td>
                          <td>{owner.email}</td>
                          <td>
                            <button
                              className='btn btn-primary btn-sm'
                              onClick={() => handleSelectUser(owner)}>
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className='py-4 text-center'>No owners found</p>
                )}
              </div>
            </>
          ) : (
            <>
              <h3 className='mb-4 text-lg font-bold'>
                Create Request for{' '}
                {selectedUser?.name || selectedUser?.username}
              </h3>
              <form onSubmit={handleSubmitRequest} className='space-y-4'>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Description</span>
                  </label>
                  <textarea
                    name='description'
                    value={requestForm.description}
                    onChange={handleRequestFormChange}
                    className='textarea textarea-bordered h-24'
                    required
                  />
                </div>

                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Price</span>
                  </label>
                  <input
                    type='number'
                    name='price'
                    value={requestForm.price}
                    onChange={handleRequestFormChange}
                    className='input input-bordered'
                    min='0'
                    step='0.01'
                    required
                  />
                </div>

                <div className='form-control mt-6'>
                  <button type='submit' className='btn btn-primary'>
                    Submit Request
                  </button>
                </div>
              </form>
              <button
                className='btn btn-ghost mt-4'
                onClick={() => setShowRequestForm(false)}>
                Back to List
              </button>
            </>
          )}
          <div className='modal-action'>
            <button className='btn' onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  )
}

ContentTableRowOptions.propTypes = {
  editor: PropTypes.string,
  video: PropTypes.object.isRequired,
}

export default ContentTableRowOptions
