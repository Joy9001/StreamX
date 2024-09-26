import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
  },

  YTchannelname: {
    type: String,
  },
  profilephoto: {
    type: String,
    default: "",
  },
  hiredEditors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Editor" }],
  videoIds: [{ type: String }],

  ytChannelLink: {
    type: String,
  },
  requestCount: {
    type: Number,
    default: 0,
  },
  storageLimit: {
    type: Number,
    default: 10 * 1024,
  },
  usedStorage: {
    type: Number,
    default: 0,
  },
  googleId: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("Owner", ownerSchema);
export default User;

