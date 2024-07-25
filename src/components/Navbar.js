import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const username = localStorage.getItem('username');

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Learning Website</Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-blue-200">Home</Link>
          <Link to="/careers" className="text-white hover:text-blue-200">Careers</Link>
          <Link to="/about" className="text-white hover:text-blue-200">About</Link>
          {isAdmin && <Link to="/adminpage" className="text-white hover:text-blue-200">Adminpage</Link>}
          {username ? (
            <>
              <span className="text-white">{username}</span>
              <button onClick={() => {
                localStorage.clear();
                window.location.reload();
              }} className="text-white hover:text-blue-200">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-200">Login</Link>
              <Link to="/signup" className="text-white hover:text-blue-200">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;