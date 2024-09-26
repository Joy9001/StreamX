import { Owner } from '../model/owner.model.js';
export const getOwnerProfile = async (req, res) => {
    try {
        const owner = await Owner.findOne({ _id: req.user.id })
            .populate('hiredEditors');

        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        res.status(200).json({
            username: owner.username,
            email: owner.email,
            YTchannelname: owner.YTchannelname,
            profilephoto: owner.profilephoto,
            ytChannelLink: owner.ytChannelLink,
            hiredEditors: owner.hiredEditors,
            videoIds: owner.videoIds,
            requestCount: owner.requestCount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};