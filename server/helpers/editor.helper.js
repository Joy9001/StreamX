import Editor from '../models/editor.models.js';
import EditorGig from '../models/editorGig.model.js';

export const findEditorByGigId = async (editorGigId) => {
    try {
        // Find the EditorGig document by ID
        const editorGig = await EditorGig.findById(editorGigId);

        if (!editorGig) {
            return null; // EditorGig not found
        }

        // Use the email from EditorGig to find the corresponding Editor
        const editor = await Editor.findOne({ email: editorGig.email });

        return editor; // Will be null if no matching Editor is found
    } catch (error) {
        console.error('Error finding Editor by EditorGig ID:', error);
        throw error;
    }
};

export const getEditorIdByGigId = async (editorGigId) => {
    try {
        const editor = await findEditorByGigId(editorGigId);
        return editor ? editor._id : null;
    } catch (error) {
        console.error('Error getting Editor ID by EditorGig ID:', error);
        throw error;
    }
};
