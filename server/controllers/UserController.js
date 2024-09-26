import User from '../model/User.js';

export const createUser = async (req, res) => {
  const { email, password, role, Id } = req.body;

  try {
    // Check if the user is trying to create a superuser
    if (role === 'superuser' && Id !== 'superuser') {
      return res.status(403).json({ message: 'Authorization not given. Only superusers can create other superusers.' });
    }

    // Check if the user is trying to create an admin
    if (role === 'admin' && Id !== 'superuser') {
      return res.status(403).json({ message: 'Authorization not given. Only superusers can create other admins.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    let permissions = {
      owner: { edit: false, delete: false },
      editor: { edit: false, delete: false },
      editorGig: { edit: false, delete: false },
      video: { delete: false },
    };

    if (role === 'superuser') {
      permissions = {
        owner: { edit: true, delete: true },
        editor: { edit: true, delete: true },
        editorGig: { edit: true, delete: true },
        video: { delete: true },
      };
    }

    const newUser = new User({
      email,
      password,
      role,
      Id,
      permissions, 
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        Id: newUser.Id,
        permissions: newUser.permissions, 
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
