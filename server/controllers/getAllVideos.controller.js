import Video from '../models/video.model.js'

export const getAllVideos = async (req, res) => {
  try {
    // Get all videos and populate owner and editor details
    const videos = await Video.find()
      .populate('ownerId', 'username email')
      .populate('editorId', 'username email')
      .sort({ _id: -1 }) // Sort by creation date (newest first)
    
    // Return the videos
    res.status(200).json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    res.status(500).json({ message: 'Error fetching videos', error: error.message })
  }
}
