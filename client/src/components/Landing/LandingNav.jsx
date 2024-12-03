import React from 'react'

const nav = () => {
  return (
    <div className="navbar bg-base-100">
            <div className="navbar-start">
            <img
              src='http://localhost:5173/src/assets/logoX.png'
              alt='Logo'
              className={`w-14 cursor-pointer rounded-full bg-black duration-500`}
            />
                <a className="btn btn-ghost text-xl">StreamX</a>
            </div>
            <div className="navbar-end">
                <div >
                    <a className="btn bg-blue-500 text-white py-2 px-4 rounded mr-8">Login</a>
                </div>
                <div>
                    <a className="btn bg-blue-500 text-white py-2 px-4 rounded">Sign Up</a>
                </div>
            </div>
        </div>
  )
}

export default nav