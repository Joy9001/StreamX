import User from '../model/User.js';

export const createUser = async (req, res) => {
  const { email, password, role, Id } = req.body;

  try {
    // Find the requesting user by Id
    const requestingUser = await User.findById(Id);
    if (!requestingUser) {
      return res.status(404).json({ message: 'Requesting user not found' });
    }

    // Check if the requesting user is authorized to create users
    if (role === 'superuser' && requestingUser.role !== 'superuser') {
      return res.status(403).json({ message: 'Authorization not given. Only superusers can create other superusers.' });
    }

    if (role === 'admin' && requestingUser.role !== 'superuser') {
      return res.status(403).json({ message: 'Authorization not given. Only superusers can create other admins.' });
    }

    // Check for existing user with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Set permissions based on the role
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

    // Create the new user
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
