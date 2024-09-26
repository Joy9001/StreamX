import User from '../model/User.js';
import EditorProfile from '../model/EditorProfile.js'; 

export const editEditorProfile = async (req, res) => {
  const { userId, profileId } = req.params; 
  const { updateData } = req.body; 

  try {
    const user = await User.findById(userId);
    const profile = await EditorProfile.findById(profileId);

    if (!user.permissions.editor.edit) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to edit this profile.' });
    }

    Object.assign(profile, updateData); 
    await profile.save();

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
