import { setDrawerContent } from '@/store/slices/uiSlice'
import { setAllVideos } from '@/store/slices/videoSlice'
import { resetYtForm } from '@/store/slices/ytFormSlice'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'
import AudienceRadioButtons from './YtFormComponents/AudienceRadioButtons'
import CategoryDropdown from './YtFormComponents/CategoryDropdown'
import LicenseOptions from './YtFormComponents/LicenseOptions'
import RecordingDateLocation from './YtFormComponents/RecordingDateLocation'
import TagsInput from './YtFormComponents/TagsInput'
import UploadFooter from './YtFormComponents/UploadFooter'
import VisibilityOptions from './YtFormComponents/VisibilityOptions'

export const YTVideoUploadForm = () => {
  const allVideos = useSelector((state) => state.video.allVideos)
  const ytVideoUpload = useSelector((state) => state.video.ytVideoUpload)
  const userData = useSelector((state) => state.user.userData)
  const ytForm = useSelector((state) => state.ytForm)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({ title: false, description: false })
  const [light, setLight] = useState(
    'https://via.placeholder.com/150x150.png?text=&bg=ffffff&shadow=true'
  )
  const { getAccessTokenSilently } = useAuth0()
  const [accessToken, setAccessToken] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const token = await getAccessTokenSilently()
        setAccessToken(token)
      } catch (error) {
        console.error('Error fetching access token:', error)
      }
    }
    if (!accessToken) fetchAccessToken()
  }, [getAccessTokenSilently, accessToken])

  useEffect(() => {
    if (ytVideoUpload) {
      setTitle(ytVideoUpload?.metaData?.name.split('.')[0] || '')
    }
  }, [ytVideoUpload])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setErrors({ title: false, description: false })
    dispatch(resetYtForm())

    // Find and click the modal close button
    const modal = document.getElementById('my_modal_3')
    if (modal) {
      modal.close()
    }
  }

  const updateVideos = (type) => {
    dispatch(
      setAllVideos(
        allVideos.map((video) => {
          if (video._id === ytVideoUpload._id) {
            return type === 'requested'
              ? {
                  ...video,
                  approvalStatus: 'Pending',
                  ytUploadStatus: 'Pending',
                }
              : { ...video, ytUploadStatus: 'Uploaded' }
          }
          return video
        })
      )
    )

    dispatch(
      setDrawerContent(
        allVideos.find((video) => video._id === ytVideoUpload._id)
      )
    )
  }

  const handleUpload = (e) => {
    e.preventDefault()
    let validationErrors = { title: false, description: false }
    if (title.trim() === '') {
      validationErrors.title = true
    }
    if (description.trim() === '') {
      validationErrors.description = true
    }
    setErrors(validationErrors)

    if (!validationErrors.title && !validationErrors.description) {
      let reqBody = {
        title,
        description,
      }

      for (const [key, value] of Object.entries(ytForm)) {
        reqBody[key] = value
      }

      console.log('identities', userData.identities)

      const googleIdentity = userData.identities.find(
        (identity) => identity.provider === 'google-oauth2'
      )
      reqBody['gAccessToken'] = googleIdentity.access_token
      reqBody['gRefreshToken'] = googleIdentity.refresh_token
      console.log('Form Data', reqBody)

      const postUrl = `${import.meta.env.VITE_BACKEND_URL}/api/yt/upload/${userData.user_metadata.role}/${userData._id}/${ytVideoUpload._id}`
      console.log('postUrl', postUrl)

      axios
        .post(postUrl, reqBody, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          console.log('Form submitted successfully!', response.data)
          resetForm()
          updateVideos('uploaded')
        })
        .catch((error) => {
          console.error('Error submitting form:', error)
        })
    }
  }

  const handleRequest = (e) => {
    e.preventDefault()
    let validationErrors = { title: false, description: false }
    if (title.trim() === '') {
      validationErrors.title = true
    }
    if (description.trim() === '') {
      validationErrors.description = true
    }
    setErrors(validationErrors)

    if (!validationErrors.title && !validationErrors.description) {
      let reqBody = {
        id: ytVideoUpload._id,
        title,
        description,
      }

      for (const [key, value] of Object.entries(ytForm)) {
        reqBody[key] = value
      }

      const postUrl = `${import.meta.env.VITE_BACKEND_URL}/api/yt/req-admin/${ytVideoUpload._id}`

      axios
        .post(postUrl, reqBody, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          console.log('Request submitted successfully!', response.data)
          resetForm()
          updateVideos('requested')
        })
        .catch((error) => {
          console.error('Error submitting request:', error)
        })
    }
  }

  return (
    <>
      <div id='webcrumbs' className=''>
        <div className='mx-auto w-full rounded-lg p-3'>
          <header className='mb-6 flex items-center justify-between p-2'>
            <h1 className='text-2xl font-semibold'>
              <span className='font-medium'>Upload Video to YouTube - </span>
              {title}
            </h1>
          </header>

          {/* Main section with Title, Description, and Video Preview */}
          <section className='mb-6 flex flex-col md:flex-row'>
            {/* Title and Description */}
            <div className='flex-[4] p-2'>
              <h2 className='mb-4 text-lg font-semibold'>Details</h2>
              <div className='mb-3'>
                <label htmlFor='title' className='mb-1 block font-medium'>
                  Title
                </label>
                <input
                  id='title'
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full rounded-md border-2 border-solid border-black p-2 ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                  aria-required='true'
                />
                {errors.title && (
                  <span className='text-red-500'>Title is required.</span>
                )}
              </div>
              <div className=''>
                <label htmlFor='description' className='mb-2 block font-medium'>
                  Description
                </label>
                <textarea
                  id='description'
                  placeholder='Tell viewers about your video'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`h-[100px] w-full resize-none rounded-md border-2 border-solid border-black p-2 ${
                    errors.description ? 'border-red-500' : ''
                  }`}></textarea>
                {errors.description && (
                  <span className='text-red-500'>Description is required.</span>
                )}
              </div>
            </div>

            {/* Video Preview with ReactPlayer */}
            <div className='ml-4 mt-4 w-full flex-[2] md:mt-0'>
              <figure className='mt-4 flex h-40 items-center justify-center rounded-xl shadow-inner'>
                <ReactPlayer
                  className='react-player flex w-full overflow-hidden rounded object-cover'
                  width='100%'
                  height={176}
                  url={
                    ytVideoUpload
                      ? ytVideoUpload.url
                      : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                  }
                  light={light}
                  controls={true}
                  onReady={() => setLight(false)}
                />
              </figure>
              <div className='mt-4'>
                <p className='text-sm font-semibold'> {title}.mp4</p>
              </div>
            </div>
          </section>

          {/* Tags Input */}
          <TagsInput />

          {/* Category Section */}
          <CategoryDropdown />

          {/* Audience Section */}
          <AudienceRadioButtons />

          {/* License Options Section */}
          <LicenseOptions />

          {/* Recording Date and Location Section */}
          <RecordingDateLocation />

          {/* Visibility Options Section */}
          <VisibilityOptions />

          {/* Footer Section */}
          <UploadFooter onUpload={handleUpload} onRequest={handleRequest} />
        </div>
      </div>
    </>
  )
}
