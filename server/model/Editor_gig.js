import mongoose from 'mongoose';
const EditorGig_Schema = mongoose.Schema({
    name:String,
    address:String,
    languages:{
        type: [String],
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    bio: {
        type: String, 
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    gig_description: {
        type: String,
        required: false
    },
    Rating: Number
});
const Editor_Gig = mongoose.model("EditorGig_Schema",EditorGig_Schema);
export default Editor_Gig;