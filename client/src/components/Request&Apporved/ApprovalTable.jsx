
function ApprovalTable() {
    const allVideo = [
        {
          _id: '1',
          name: 'Video 1',
          Owner: 'John Doe',
          fileSize: '10MB',
        },
        {
          _id: '2',
          name: 'Video 2',
          Owner: 'Jane Doe',
          fileSize: '5MB',
        },
        {
          _id: '3',
          name: 'Video 3',
          Owner: 'Alice Doe',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
        {
          _id: '4',
          name: 'Video 4',
          Owner: 'Garry',
          fileSize: '20MB',
        },
      ]

  return (
    <>
    <div className="flex flex-col h-screen ">
      {/* Upper Section: editor Request */}
      <div className="h-[35vh] flex flex-col ">
        <h2 className="text-center font-bold">Editor Request</h2>
        <div className="no-scrollbar overflow-auto flex-grow">
          <table className="table table-pin-rows border border-gray-400 border-collapse w-full">
            {/* Table Head */}
            <thead>
              <tr>
                <th className="border border-gray-400">Request ID</th>
                <th className="border border-gray-400">Name</th>
                <th className="border border-gray-400">Owner</th>
                <th className="border border-gray-400">File Size</th>
                <th className="border border-gray-400">Approval Status</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {allVideo?.length ? (
                allVideo.map((video) => (
                  <tr key={video._id}>
                    <td className="border border-gray-400">{video._id}</td>
                    <td className="border border-gray-400">{video.name}</td>
                    <td className="border border-gray-400">{video.Owner}</td>
                    <td className="border border-gray-400">{video.fileSize}</td>
                    <td className="border border-gray-400">
                        <button className='btn btn-success mr-5 btn-sm'>Approve</button>
                        <button className='btn btn-danger btn-sm'>Reject</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border border-gray-400 text-center">
                    No videos available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Lower Section: Admin Request */}
      <div className="h-[35vh] flex flex-col mt-10">
        <h2 className="text-center font-bold">Admin Request</h2>
        <div className="no-scrollbar overflow-auto flex-grow">
          <table className="table table-pin-rows border border-gray-400 border-collapse w-full">
            {/* Table Head */}
            <thead>
              <tr>
                <th className="border border-gray-400">Request ID</th>
                <th className="border border-gray-400">Name</th>
                <th className="border border-gray-400">Editor</th>
                <th className="border border-gray-400">File Size</th>
                <th className="border border-gray-400">Approval Status</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {allVideo?.length ? (
                allVideo.map((video) => (
                  <tr key={video._id}>
                    <td className="border border-gray-400">{video._id}</td>
                    <td className="border border-gray-400">{video.name}</td>
                    <td className="border border-gray-400">{video.editor}</td>
                    <td className="border border-gray-400">{video.fileSize}</td>
                    <td className="border border-gray-400">
                        <button className='btn btn-success mr-5 btn-sm'>Approve</button>
                        <button className='btn btn-danger btn-sm'>Reject</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border border-gray-400 text-center">
                    No videos available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>
  )
}

export default ApprovalTable
