import userCircle from '@/assets/user-circle.svg'
import { setDrawerContent, setDrawerOpen } from '@/store/slices/uiSlice'
import { setYtVideoUpload } from '@/store/slices/videoSlice'
import { filesize } from 'filesize'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import ContenetTableRowOptions from './ContentTableRowOptions'
import YtUPendingBtn from './YtStatusBtnComponents/YtPendingBtn'
import YtRetryBtn from './YtStatusBtnComponents/YtRetryBtn'
import YtUploadBtn from './YtStatusBtnComponents/YtUploadBtn'
import YtUploadedBtn from './YtStatusBtnComponents/YtUploadedBtn'
import YtUploadingBtn from './YtStatusBtnComponents/YtUploadingBtn'

function ContentTableRow({ content }) {
  console.log('content in ContentTableRow', content)
  const [ytBtn, setYtBtn] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    switch (content.ytUploadStatus) {
      case 'None':
        setYtBtn(YtUploadBtn)
        break
      case 'Pending':
        setYtBtn(YtUPendingBtn)
        break
      case 'Uploading':
        setYtBtn(YtUploadingBtn)
        break
      case 'Uploaded':
        setYtBtn(YtUploadedBtn)
        break
      default:
        setYtBtn(YtRetryBtn)
        break
    }
  }, [content.ytUploadStatus])

  function handleRowClick() {
    dispatch(setDrawerOpen(true))
    dispatch(setDrawerContent(content))
  }

  function handleYtUpload() {
    document.getElementById('my_modal_3').showModal()
    dispatch(setYtVideoUpload(content))
    console.log('uploading to youtube')
  }

  return (
    <>
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
        <td
          className='w-40'
          onClick={content.ytUploadStatus === 'None' ? handleYtUpload : null}>
          {ytBtn}
        </td>
        <td className='w-40'>
          <span className='text-sm'>{content.approvalStatus}</span>
        </td>
        <td className='w-40'>
          <ContenetTableRowOptions video={content} />
        </td>
      </tr>
    </>
  )
}

ContentTableRow.propTypes = {
  content: PropTypes.object.isRequired,
}
export default ContentTableRow
