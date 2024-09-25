import ContentTableRow from './ContenetTableRow'
function ContentTable() {
  return (
    <>
      <div className='no-scrollbar h-[30rem] overflow-x-auto'>
        <table className='table table-pin-rows'>
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Editor</th>
              <th>Last Modified</th>
              <th>File size</th>
              <th>YT Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <ContentTableRow
              content={{
                title: 'Dummy.mp4',
                url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                owner: 'Joy Mridha',
                ownerPic:
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
                editor: 'Jokeward',
                editorPic:
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
                createdAt: '2021-08-01',
                updatedAt: '2021-09-01',
                location: 'Storage',
                type: 'Video',
                size: '1.5GB',
                ytStatus: 'None',
              }}
            />
            {/* row 2 */}
            <ContentTableRow
              content={{
                title: 'Dummy.mp4',
                url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                owner: 'Joy Mridha',
                ownerPic:
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
                editor: 'Jokeward',
                editorPic:
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
                createdAt: '2021-08-01',
                updatedAt: '2021-09-01',
                location: 'Storage',
                type: 'Video',
                size: '1.5GB',
                ytStatus: 'Pending',
              }}
            />
            {/* row 3 */}
            <ContentTableRow
              content={{
                title: 'Dummy.mp4',
                url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                owner: 'Joy Mridha',
                ownerPic:
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
                editor: 'Jokeward',
                editorPic:
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
                createdAt: '2021-08-01',
                updatedAt: '2021-09-01',
                location: 'Storage',
                type: 'Video',
                size: '1.5GB',
                ytStatus: 'Uploading',
              }}
            />
            {/* row 4 */}
            <ContentTableRow
              content={{
                title: 'Dummy.mp4',
                url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                owner: 'Joy Mridha',
                ownerPic:
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
                editor: 'Jokeward',
                editorPic:
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
                createdAt: '2021-08-01',
                updatedAt: '2021-09-01',
                location: 'Storage',
                type: 'Video',
                size: '1.5GB',
                ytStatus: 'Uploaded',
              }}
            />
            {/* row 5 */}
            <ContentTableRow
              content={{
                title: 'Dummy.mp4',
                url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                owner: 'Joy Mridha',
                ownerPic:
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
                editor: 'Jokeward',
                editorPic:
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
                createdAt: '2021-08-01',
                updatedAt: '2021-09-01',
                location: 'Storage',
                type: 'Video',
                size: '1.5GB',
                ytStatus: 'Failed',
              }}
            />
            {/* ////////////////// */}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ContentTable
