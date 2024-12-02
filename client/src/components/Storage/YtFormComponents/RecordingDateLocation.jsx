import { setRecordingDate, setLocation } from '@/store/slices/ytFormSlice'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

const RecordingDateLocation = () => {
  const dispatch = useDispatch()
  const recordingDate = useSelector((state) => state.ytForm.recordingDate)
  const location = useSelector((state) => state.ytForm.location)

  const handleDateChange = (e) => {
    const date = new Date(e.target.value)
    dispatch(setRecordingDate(date))
  }

  return (
    <div className='mt-6'>
      <h3 className='mb-2 text-lg font-semibold'>
        Recording Date and Location
      </h3>
      <p className='mb-4 text-sm text-gray-600'>
        Add when and where your video was recorded. Viewers can search for
        videos by location.
      </p>

      <div className='flex space-x-3'>
        <div className='mb-4'>
          <label htmlFor='recordingDate' className='mb-1 block font-medium'>
            Date
          </label>
          <input
            type='date'
            id='recordingDate'
            value={
              recordingDate ? recordingDate.toISOString().split('T')[0] : ''
            }
            onChange={handleDateChange}
            className='w-full rounded-md border-2 border-solid border-black p-2'
          />
        </div>

        <div>
          <label htmlFor='location' className='mb-1 block font-medium'>
            Location
          </label>
          <input
            id='location'
            type='text'
            value={location}
            onChange={(e) => dispatch(setLocation(e.target.value))}
            className='w-full rounded-md border-2 border-solid border-black p-2'
            placeholder='Enter location'
            aria-required='true'
          />
        </div>
      </div>
    </div>
  )
}

RecordingDateLocation.propTypes = {
  recordingDate: PropTypes.instanceOf(Date),
  location: PropTypes.string,
}

export default RecordingDateLocation
