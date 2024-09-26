import { filesize } from 'filesize'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import userCircle from '../assets/user-circle.svg'
import { drawerContentState, drawerState } from '../states/drawerState.js'
import ContenetTableRowOptions from './ContentTableRowOptions'

function ContentTableRow({ content }) {
  const [ytBtn, setYtBtn] = useState('')
  const setDrawerState = useRecoilState(drawerState)[1]
  const setDrawerContentState = useRecoilState(drawerContentState)[1]

  useEffect(() => {
    switch (content.ytUploadStatus) {
      case 'None':
        setYtBtn(
          <button className='btn border-red-500 bg-white text-red-500 hover:border-red-500 hover:text-red-500'>
            <svg
              className='h-5 w-5'
              viewBox='0 0 16 16'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'>
              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
              <g
                id='SVGRepo_tracerCarrier'
                strokeLinecap='round'
                strokeLinejoin='round'></g>
              <g id='SVGRepo_iconCarrier'>
                <path
                  fill='red'
                  d='M14.712 4.633a1.754 1.754 0 00-1.234-1.234C12.382 3.11 8 3.11 8 3.11s-4.382 0-5.478.289c-.6.161-1.072.634-1.234 1.234C1 5.728 1 8 1 8s0 2.283.288 3.367c.162.6.635 1.073 1.234 1.234C3.618 12.89 8 12.89 8 12.89s4.382 0 5.478-.289a1.754 1.754 0 001.234-1.234C15 10.272 15 8 15 8s0-2.272-.288-3.367z'></path>
                <path
                  fill='#ffffff'
                  d='M6.593 10.11l3.644-2.098-3.644-2.11v4.208z'></path>
              </g>
            </svg>
            Upload
          </button>
        )
        break
      case 'Pending':
        setYtBtn(
          <button className='btn no-animation border-yellow-500 bg-white text-yellow-500 hover:border-yellow-500 hover:text-yellow-500'>
            <svg
              className='h-5 w-5'
              viewBox='0 0 30 30'
              id='Layer_1'
              version='1.1'
              xmlSpace='preserve'
              xmlns='http://www.w3.org/2000/svg'
              fill='#FFDF1D'>
              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
              <g
                id='SVGRepo_tracerCarrier'
                strokeLinecap='round'
                strokeLinejoin='round'></g>
              <g id='SVGRepo_iconCarrier'>
                <path
                  className='st8'
                  d='M15,4C8.9,4,4,8.9,4,15s4.9,11,11,11s11-4.9,11-11S21.1,4,15,4z M21.7,16.8c-0.1,0.4-0.5,0.6-0.9,0.5l-5.6-1.1 c-0.2,0-0.4-0.2-0.6-0.3C14.2,15.7,14,15.4,14,15c0,0,0,0,0,0l0.2-8c0-0.5,0.4-0.8,0.8-0.8c0.4,0,0.8,0.4,0.8,0.8l0.1,6.9l5.2,1.8 C21.6,15.8,21.8,16.3,21.7,16.8z'></path>
              </g>
            </svg>
            Pending
          </button>
        )
        break
      case 'Uploading':
        setYtBtn(
          <button className='btn no-animation border-blue-500 bg-white text-blue-500 hover:border-blue-500 hover:text-blue-500'>
            <span className='loading loading-spinner loading-xs'></span>
            Uploading
          </button>
        )
        break
      case 'Uploaded':
        setYtBtn(
          <button className='btn no-animation border-green-500 bg-white text-green-500 hover:border-green-500 hover:text-green-500'>
            <svg
              className='h-5 w-5'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
              <g
                id='SVGRepo_tracerCarrier'
                strokeLinecap='round'
                strokeLinejoin='round'></g>
              <g id='SVGRepo_iconCarrier'>
                {' '}
                <path
                  d='M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z'
                  fill='#22c55e'></path>{' '}
              </g>
            </svg>
            Uploaded
          </button>
        )
        break
      default:
        setYtBtn(
          <button className='btn no-animation border-black bg-white text-black hover:border-black hover:text-black'>
            <svg
              className='h-5 w-5'
              viewBox='0 0 48 48'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
              <g
                id='SVGRepo_tracerCarrier'
                strokeLinecap='round'
                strokeLinejoin='round'></g>
              <g id='SVGRepo_iconCarrier'>
                {' '}
                <rect
                  width='48'
                  height='48'
                  fill='white'
                  fillOpacity='0.01'></rect>{' '}
                <path
                  d='M36.7279 36.7279C33.4706 39.9853 28.9706 42 24 42C14.0589 42 6 33.9411 6 24C6 14.0589 14.0589 6 24 6C28.9706 6 33.4706 8.01472 36.7279 11.2721C38.3859 12.9301 42 17 42 17'
                  stroke='#000000'
                  strokeWidth='4'
                  strokeLinecap='round'
                  strokeLinejoin='round'></path>{' '}
                <path
                  d='M42 8V17H33'
                  stroke='#000000'
                  strokeWidth='4'
                  strokeLinecap='round'
                  strokeLinejoin='round'></path>{' '}
              </g>
            </svg>
            Retry
          </button>
        )
        break
    }
  }, [content.ytUploadStatus])

  function handleRowClick() {
    setDrawerState(true)
    setDrawerContentState(content)
  }

  function handleYtUpload() {
    // axios
    //   .post('/api/yt/upload', { videoId: content._id })
    //   .then((res) => {
    //     console.log(res.data)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
    console.log('uploading to youtube')
  }

  return (
    <tr className='cursor-pointer hover:bg-gray-100'>
      <td onClick={handleRowClick}>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center'>
            <div className='mask mask-squircle flex h-12 w-12 items-center justify-center'>
              <div>
                <svg
                  className='h-8 w-8'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g
                    id='SVGRepo_tracerCarrier'
                    strokeLinecap='round'
                    strokeLinejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    {' '}
                    <path
                      d='M14.7295 2H9.26953V6.36H14.7295V2Z'
                      fill='#70acc7'></path>{' '}
                    <path
                      d='M16.2305 2V6.36H21.8705C21.3605 3.61 19.3305 2.01 16.2305 2Z'
                      fill='#70acc7'></path>{' '}
                    <path
                      d='M2 7.85938V16.1894C2 19.8294 4.17 21.9994 7.81 21.9994H16.19C19.83 21.9994 22 19.8294 22 16.1894V7.85938H2ZM14.44 16.1794L12.36 17.3794C11.92 17.6294 11.49 17.7594 11.09 17.7594C10.79 17.7594 10.52 17.6894 10.27 17.5494C9.69 17.2194 9.37 16.5394 9.37 15.6594V13.2594C9.37 12.3794 9.69 11.6994 10.27 11.3694C10.85 11.0294 11.59 11.0894 12.36 11.5394L14.44 12.7394C15.21 13.1794 15.63 13.7994 15.63 14.4694C15.63 15.1394 15.2 15.7294 14.44 16.1794Z'
                      fill='#70acc7'></path>{' '}
                    <path
                      d='M7.76891 2C4.66891 2.01 2.63891 3.61 2.12891 6.36H7.76891V2Z'
                      fill='#70acc7'></path>{' '}
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-center truncate'>
            <div className='font-bold'>{content.metaData.name}</div>
          </div>
        </div>
      </td>
      <td onClick={handleRowClick}>
        <div className='flex items-center space-x-2'>
          <div className='avatar'>
            <div className='w-8 rounded-full'>
              <img
                alt={content.owner || 'owner'}
                src={content.ownerPic || userCircle}
              />
            </div>
          </div>
          <span className='text-sm'>{content.owner || '-'}</span>
        </div>
      </td>
      <td onClick={handleRowClick}>
        <div className='flex items-center space-x-2'>
          <div className='avatar'>
            <div className='w-8 rounded-full'>
              <img
                alt={content.editor || 'editor'}
                src={content.editorPic || userCircle}
              />
            </div>
          </div>
          <span className='text-sm'>{content.editor || '-'}</span>
        </div>
      </td>
      <td onClick={handleRowClick}>
        <span className='text-sm'>
          {new Date(content.updatedAt).toLocaleDateString()}
        </span>
      </td>
      <td onClick={handleRowClick}>
        <span className='text-sm'>{filesize(content.metaData.size)}</span>
      </td>
      <td className='w-40' onClick={handleYtUpload}>
        {ytBtn}
      </td>
      <td className='w-40'>
        <span className='text-sm'>{content.approvalStatus}</span>
      </td>
      <td className='w-40'>
        <ContenetTableRowOptions
          editor={content.editor}
          videoId={content._id}
        />
      </td>
    </tr>
  )
}

ContentTableRow.propTypes = {
  content: PropTypes.object.isRequired,
}
export default ContentTableRow
