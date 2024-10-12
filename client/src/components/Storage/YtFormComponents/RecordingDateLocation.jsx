import {
  locationState,
  recordingDateState,
} from '@/states/YtFormStates/recordingState'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useRecoilState } from 'recoil'

const RecordingDateLocation = () => {
  const [recordingDate, setRecordingDate] = useRecoilState(recordingDateState)
  const [location, setLocation] = useRecoilState(locationState)

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
          <DatePicker
            selected={recordingDate}
            onChange={(date) => setRecordingDate(date)}
            dateFormat='yyyy/MM/dd'
            className='w-full rounded-md border-2 border-solid border-black p-2'
            placeholderText='Select a date'
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
            onChange={(e) => setLocation(e.target.value)}
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
  recordingDate: PropTypes.instanceOf(Date), // The selected recording date
  location: PropTypes.string, // The recording location
}

export default RecordingDateLocation
