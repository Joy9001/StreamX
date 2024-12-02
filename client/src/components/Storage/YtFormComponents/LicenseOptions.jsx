import { useDispatch, useSelector } from 'react-redux'
import { setLicense, setAllowEmbedding } from '@/store/slices/ytFormSlice'
import PropTypes from 'prop-types'

const LicenseOptions = () => {
  const dispatch = useDispatch()
  const license = useSelector((state) => state.ytForm.license)
  const allowEmbedding = useSelector((state) => state.ytForm.allowEmbedding)

  return (
    <div className='mt-6'>
      <h3 className='mb-2 text-lg font-semibold'>License</h3>
      <p className='mb-4 text-sm text-gray-600'>
        Learn about{' '}
        <a
          href='https://support.google.com/youtube/answer/2797468?hl=en-GB'
          target='_blank'
          rel='noopener noreferrer'
          className='text-decoration-none text-blue-500'>
          license types.
        </a>
      </p>
      <select
        value={license}
        onChange={(e) => dispatch(setLicense(e.target.value))}
        className='w-full rounded-md border-2 border-solid border-black p-2'>
        <option value='standard'>Standard YouTube License</option>
        <option value='creative_commons'>Creative Commons - Attribution</option>
      </select>

      <div className='mt-4 flex items-center'>
        <input
          type='checkbox'
          checked={allowEmbedding}
          onChange={(e) => dispatch(setAllowEmbedding(e.target.checked))}
          className='checkbox checkbox-sm mr-2'
        />
        <label className='flex space-x-2'>
          <p>Allow embedding</p>{' '}
          <p className='flex justify-center text-sm text-gray-400'>
            (Allow others to embed your video in their sites. &nbsp;
            <a
              href='https://support.google.com/youtube/answer/171780'
              className='text-blue-500'>
              Learn more
            </a>
            )
          </p>
        </label>
      </div>
    </div>
  )
}

LicenseOptions.propTypes = {
  license: PropTypes.string, // The selected license option
  allowEmbedding: PropTypes.bool, // Whether embedding is allowed
}

export default LicenseOptions
