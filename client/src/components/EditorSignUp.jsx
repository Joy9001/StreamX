import React, { useState } from 'react';
import '../loginsignup.css'; // Keeping this in case you're using additional custom styles

const EditorSignup = () => {
  // Initially show the editor sign-up form
  const [activeForm, setActiveForm] = useState('editor-signup');

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Editor Sign Up Form */}
      {activeForm === 'editor-signup' && (
        <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Sign Up as Editor</h2>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              required
            />
          </div>

          <button className="btn btn-primary w-full mb-4">Sign Up as Editor</button>

          <button className="btn btn-outline w-full mb-4">Sign in with Google</button>
          
          {/* Links to other sign-up or sign-in pages */}
          <div className="text-center">
            <a href="/signup/owner" className="link">Sign Up as Owner</a>
          </div>

          <div className="text-center mt-2">
            <a href="/signin" className="link">Already have an account? Sign In</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorSignup;
