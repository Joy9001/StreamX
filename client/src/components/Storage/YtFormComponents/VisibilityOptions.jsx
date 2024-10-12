import { visibilityState } from '@/states/YtFormStates/visibilityState'
import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'

const VisibilityOptions = () => {
  const [visibility, setVisibility] = useRecoilState(visibilityState)

  return (
    <div className='mt-6'>
      <h3 className='mb-2 text-lg font-semibold'>Visibility</h3>
      <p className='mb-4 text-sm text-gray-600'>
        Choose when to publish and who can see your video
      </p>
      <div className='flex flex-col space-y-2'>
        <label className='flex items-center'>
          <input
            type='radio'
            name='radio-2'
            value='private'
            checked={visibility === 'private'}
            onChange={() => setVisibility('private')}
            className='radio radio-sm mr-2'
          />
          Private - Only you and people who you choose can watch your video
        </label>
        <label className='flex items-center'>
          <input
            type='radio'
            name='radio-2'
            value='unlisted'
            checked={visibility === 'unlisted'}
            onChange={() => setVisibility('unlisted')}
            className='radio radio-sm mr-2'
          />
          Unlisted - Anyone with the video link can watch your video
        </label>
        <label className='flex items-center'>
          <input
            type='radio'
            name='radio-2'
            value='public'
            checked={visibility === 'public'}
            onChange={() => setVisibility('public')}
            className='radio radio-sm mr-2'
          />
          Public - Everyone can watch your video
        </label>
      </div>
    </div>
  )
}

VisibilityOptions.propTypes = {
  visibility: PropTypes.string, // The visibility option selected by the user
}

export default VisibilityOptions
