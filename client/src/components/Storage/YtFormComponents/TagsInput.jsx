import { useDispatch, useSelector } from 'react-redux'
import { setTags } from '@/store/slices/ytFormSlice'
import PropTypes from 'prop-types'
import { useState } from 'react'

const TagsInput = () => {
  const tags = useSelector((state) => state.ytForm.tags)
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      dispatch(setTags([...tags, inputValue.trim()]))
      setInputValue('') // Reset input field
    }
  }

  const handleRemoveTag = (index) => {
    dispatch(setTags(tags.filter((_, i) => i !== index)))
  }

  return (
    <div className='mt-6'>
      <label className='mb-1 block font-medium'>Tags</label>
      <p className='mb-4 text-sm text-gray-600'>
        Tags can be useful if content in your video is commonly misspelt.
        Otherwise, tags play a minimal role in helping viewers to find your
        video.{' '}
        <a
          href='https://support.google.com/youtube/answer/146402?hl=en-GB'
          className='text-blue-500'
          target='_blank'>
          Learn more
        </a>
      </p>
      <div className='flex flex-wrap items-center gap-2 rounded-md border-2 border-solid border-black p-2'>
        {tags.map((tag, index) => (
          <span
            key={index}
            className='inline-flex items-center rounded-full bg-neutral-500 px-2 py-1 text-sm text-white'>
            {tag}
            <button
              type='button'
              className='ml-2 text-xs text-black'
              onClick={() => handleRemoveTag(index)}>
              ✕
            </button>
          </span>
        ))}
        <input
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder='Press Enter to add tags'
          className='w-full rounded-md p-2 focus:outline-none'
        />
      </div>
    </div>
  )
}

TagsInput.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string), // Redux state (tags) type validation
}

export default TagsInput
