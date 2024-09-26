import React, { useState } from 'react';
import '../loginsignup.css'; // Keeping your existing CSS file in case you're using additional custom styles.

const OwnerSignup = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Owner Sign Up Form */}
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up as Owner</h2>
        
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

        <button className="btn btn-primary w-full mb-4">Sign Up as Owner</button>

        <button className="btn btn-outline w-full mb-4">Sign in with Google</button>

        <div className="text-center">
          <a href="/signup/editor" className="link">Sign Up as Editor</a>
        </div>

        <div className="text-center mt-2">
          <a href="/signin" className="link">Already have an account? Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default OwnerSignup;
