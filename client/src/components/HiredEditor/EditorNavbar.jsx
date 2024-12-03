import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, User, FileText, Menu, Zap } from 'lucide-react'

function NavItem({ icon, text, onClick }) {
  return (
    <li className="flex justify-center">
      <a
        onClick={onClick}
        className="btn btn-ghost mx-1 flex items-center justify-center rounded-full text-gray-700 hover:bg-purple-100 hover:text-purple-700"
      >
        {icon}
        <span className="ml-2">{text}</span>
      </a>
    </li>
  )
}

function EditorNavbar() {
  const navigate = useNavigate()

  return (
    <nav className="navbar sticky top-0 z-50 bg-gradient-to-r from-violet-100 via-pink-100 to-purple-100 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out">
      <div className="navbar-start w-1/4">
        <a
          className="btn btn-ghost text-2xl font-bold normal-case"
          onClick={() => navigate('/storage')}
        >
          <Zap className="mr-2 h-6 w-6 text-purple-600" />
          <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            StreamX
          </span>
        </a>
      </div>

      <div className="navbar-center w-2/4 hidden lg:flex justify-center">
        <ul className="menu menu-horizontal px-1 flex justify-center items-center gap-2">
          <NavItem icon={<Home />} text="Storage" onClick={() => navigate('/storage')} />
          <NavItem icon={<User />} text="Profile" onClick={() => navigate('/profile/owner')} />
          <NavItem icon={<FileText />} text="Request Section" onClick={() => navigate('/raas')} />
        </ul>
      </div>

      <div className="navbar-end w-1/4 lg:hidden">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <Menu className="h-5 w-5" />
          </label>
          <ul tabIndex={0} className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow">
            <li><a onClick={() => navigate('/storage')}>Storage</a></li>
            <li><a onClick={() => navigate('/profile/owner')}>Profile</a></li>
            <li><a onClick={() => navigate('/raas')}>Request Section</a></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default EditorNavbar