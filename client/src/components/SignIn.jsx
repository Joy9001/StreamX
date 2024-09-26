import React, { useState } from 'react';
import '../loginsignup.css'; // Keeping this in case you're using additional custom styles

const SignIn = () => {
  const [activeForm, setActiveForm] = useState('login');

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Login Form */}
      {activeForm === 'login' && (
        <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          
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

          <button className="btn btn-primary w-full mb-4">Login</button>

          <button className="btn btn-outline w-full mb-4">Sign in with Google</button>

          <div className="text-center mt-4">
            <a href="/signup/owner" className="link">Don't have an account? Sign Up</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
