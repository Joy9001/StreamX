import mongoose from "mongoose";

const editorProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  software: {
    type: [String],
    required: true,
  },
  specializations: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

const EditorProfile = mongoose.model('EditorProfile', editorProfileSchema);
export default EditorProfile;
