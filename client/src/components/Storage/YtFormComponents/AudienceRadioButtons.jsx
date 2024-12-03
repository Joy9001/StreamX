import { useDispatch, useSelector } from 'react-redux'
import { setAudience } from '@/store/slices/ytFormSlice'
import PropTypes from 'prop-types'

const AudienceRadioButtons = () => {
  const audience = useSelector((state) => state.ytForm.audience)
  const dispatch = useDispatch()

  const handleAudienceChange = (e) => {
    dispatch(setAudience(e.target.value))
  }

  return (
    <div className='mt-6'>
      <h3 className='mb-2 text-lg font-semibold'>Audience</h3>
      <div className='mb-4 text-sm text-gray-600'>
        This video is set to {audience == 'notMadeForKids' && 'not'} &#39;Made
        for Kids&#39; {` `}
        <div className='badge badge-neutral'>Set by you</div>
      </div>
      <p className='mb-4 text-sm text-gray-600'>
        Regardless of your location, you&#39;re legally required to comply with
        the Children&#39;s Online Privacy Protection Act (COPPA) and/or other
        laws. You&#39;re required to tell us whether your videos are &#39;Made
        for Kids&#39;.{' '}
        <a
          href='https://support.google.com/youtube/answer/9528076?hl=en'
          target='_blank'
          style={{ color: 'blue', textDecoration: 'none' }}>
          What is &#39;Made for Kids&#39; content?
        </a>
      </p>
      <div className='mb-4 flex rounded-lg border-2 border-neutral p-2 text-sm text-gray-600'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          className='h-6 w-6 shrink-0 stroke-neutral'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
        </svg>
        <div className='ml-2'>
          Features like personalised ads and notifications won&#39;t be
          available on videos &#39;Made for Kids&#39;. Videos that are set as
          &#39;Made for Kids&#39; by you are more likely to be recommended
          alongside other children&#39;s videos.{' '}
          <a
            href='https://support.google.com/youtube/answer/9527654?hl=en-GB'
            target='_blank'
            style={{ color: 'blue', textDecoration: 'none' }}>
            Learn more
          </a>
        </div>
      </div>
      <div className='mb-2'>
        <label className='flex items-center'>
          <input
            type='radio'
            value='madeForKids'
            name='radio-1'
            checked={audience === 'madeForKids'}
            onChange={handleAudienceChange}
            className='radio radio-sm mr-2'
          />
          Yes, it&#39;s &#39;Made for Kids&#39;
        </label>
      </div>
      <div>
        <label className='flex items-center'>
          <input
            type='radio'
            name='radio-1'
            value='notMadeForKids'
            checked={audience === 'notMadeForKids'}
            onChange={handleAudienceChange}
            className='radio radio-sm mr-2'
          />
          No, it&#39;s not &#39;Made for Kids&#39;
        </label>
      </div>
    </div>
  )
}

AudienceRadioButtons.propTypes = {
  audience: PropTypes.string, // The selected audience option
}

export default AudienceRadioButtons
