import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import AudienceRadioButtons from './YtFormComponents/AudienceRadioButtons'
import CategoryDropdown from './YtFormComponents/CategoryDropdown'
import LicenseOptions from './YtFormComponents/LicenseOptions'
import RecordingDateLocation from './YtFormComponents/RecordingDateLocation'
import TagsInput from './YtFormComponents/TagsInput'
import UploadFooter from './YtFormComponents/UploadFooter'
import VisibilityOptions from './YtFormComponents/VisibilityOptions'

export const YTVideoUploadForm = () => {
  const ytVideoUpload = useSelector((state) => state.video.ytVideoUpload)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({ title: false, description: false })
  const [light, setLight] = useState(
    'https://via.placeholder.com/150x150.png?text=&bg=ffffff&shadow=true'
  )

  useEffect(() => {
    if (ytVideoUpload) {
      setTitle(ytVideoUpload?.metaData?.name.split('.')[0] || '')
    }
  }, [ytVideoUpload])

  const handleSubmit = () => {
    let validationErrors = { title: false, description: false }

    // Check if title is empty
    if (title.trim() === '') {
      validationErrors.title = true
    }

    // Check if description is empty (you can make this optional if needed)
    if (description.trim() === '') {
      validationErrors.description = true
    }

    setErrors(validationErrors)

    // Proceed only if no errors
    if (!validationErrors.title && !validationErrors.description) {
      // Perform form submission logic here
      console.log('Form submitted successfully!')
    }
  }

  return (
    <>
      <div id='webcrumbs' className='p-4'>
        <div className='mx-auto w-full rounded-lg p-6'>
          <header className='mb-6 flex items-center justify-between p-2'>
            <h1 className='text-2xl font-semibold'>{title}</h1>
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
          <UploadFooter onUpload={handleSubmit} />
        </div>
      </div>
    </>
  )
}
