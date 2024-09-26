import User from '../model/User.js';
import EditorProfile from '../model/EditorProfile.js';
export const deleteEditorProfile = async (req, res) => {
    const { userId, profileId } = req.params;
    try {
      const user = await User.findById(userId);
      const profile = await EditorProfile.findById(profileId);
  
      if (!user.permissions.editor.delete) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this profile.' });
      }
  
      await profile.remove();
  
      res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };