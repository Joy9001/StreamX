import { Owner } from '../model/owner.model.js';
import { storage } from '../helpers/firebase.helper.js';
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from 'firebase/storage'

// Controller for creating a new profile
export const createOwnerProfile = async (req, res) => {
    try {
        const { username, email, YTchannelname, ytChannelLink } = req.body;
        const { file } = req
        console.log("file in createOwnerprofile: ", file)

        if (!file) {
            return res.status(400).send({
                message: "No image provided"
            })
        }


        const fileRef = ref(storage, `profilephoto/${file.originalname}`)
        const uploadTask = uploadBytesResumable(fileRef, file.buffer)

        await uploadTask

        const downloadURL = await getDownloadURL(fileRef)

        const regex = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            username: /^[A-Za-z0-9_]{3,15}$/,
            ytChannelLink: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
        };

        if (!regex.username.test(username)) {
            return res.status(400).json({ message: 'Invalid username. Must be 3-15 alphanumeric characters or underscores.' });
        }

        if (!regex.email.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (!regex.ytChannelLink.test(ytChannelLink)) {
            return res.status(400).json({ message: 'Invalid YouTube channel link.' });
        }


        const newOwner = new Owner({
            username,
            email,
            YTchannelname,
            ytChannelLink,
            profilephoto: downloadURL,
            hiredEditors: [],
            videoIds: [],
        });

        await newOwner.save();

        res.status(201).json({
            message: "Profile successfully created!",
            owner: newOwner,
        });

    } catch (error) {
        res.status(500).json({ message: "Error creating profile", error });
    }
};

// Controller for updating an existing profile
export const updateOwnerProfile = async (req, res) => {
    try {
        const { username, email, YTchannelname, ytChannelLink } = req.body;

        const { file } = req
        console.log("file in updateOwnerprofile: ", file)

        if (!file) {
            return res.status(400).send({
                message: "No image provided"
            })
        }

        // find the image in firebase
        // Create a reference under which you want to list
        const listRef = ref(storage, 'profilephoto');

        // Find all the prefixes and items.
        const allFiles = await listAll(listRef)

        allFiles.items.forEach(async (itemRef) => {
            console.log(itemRef, "\n")
            if (itemRef.name == file.originalname) {
                await deleteObject(itemRef) //delete file
            }
        });

        const storageRef = ref(storage, `profilephoto/${file.originalname}`)
        const uploadTask = uploadBytesResumable(storageRef, file.buffer)

        await uploadTask

        const downloadURL = await getDownloadURL(storageRef)

        const regex = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            username: /^[A-Za-z0-9_]{3,15}$/,
            ytChannelLink: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
        };


        if (!regex.username.test(username)) {
            return res.status(400).json({ message: 'Invalid username. Must be 3-15 alphanumeric characters or underscores.' });
        }

        if (!regex.email.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (!regex.ytChannelLink.test(ytChannelLink)) {
            return res.status(400).json({ message: 'Invalid YouTube channel link.' });
        }


        const owner = await Owner.findOne({ _id: req.user.id });

        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        owner.username = username || owner.username;
        owner.email = email || owner.email;
        owner.YTchannelname = YTchannelname || owner.YTchannelname;
        owner.ytChannelLink = ytChannelLink || owner.ytChannelLink;

        if (req.file) {
            owner.profilephoto = downloadURL;
        }

        await owner.save();

        res.status(200).json({
            message: "Profile successfully updated!",
            owner,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
};
