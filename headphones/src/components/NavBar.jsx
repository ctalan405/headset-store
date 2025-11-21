import React, { useState, useEffect } from 'react';
import './NavBar.css';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const navigate = useNavigate();

  useEffect(() => {
    const updateLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem('access_token'));
      setUsername(localStorage.getItem('username'));
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('loginStatusChanged', updateLoginStatus);
    updateLoginStatus();
    return () => {
      window.removeEventListener('loginStatusChanged', updateLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUsername(null);
    setRole(null);
    navigate('/login');
    window.dispatchEvent(new Event('loginStatusChanged'));
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link className="nav-link" to="/">Home</Link></li>
        <li className="navbar-item"><Link className="nav-link" to="/cart">Cart</Link></li>
        {role === 'admin' && (
          <li className="navbar-item"><Link className="nav-link" to="/add">Add</Link></li>
        )}
        {isLoggedIn ? (
          <li className="navbar-item">
            <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
          </li>
        ) : (
          <li className="navbar-item"><Link className="nav-link" to="/login">Login</Link></li>
        )}
      </ul>
      <div className="navbar-greeting">
        {username ? <>Welcome {username}</> : <>Welcome Guest</>}
      </div>
    </nav>
  );
};

export default NavBar;
