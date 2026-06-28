import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css'; // Import the CSS file
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import Search from './Search'; // Import the Search component
import { useAuth } from '../context/AuthContext'; // Import the AuthContext
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext
import ToggleSwitch from './ToggleSwitch'; // Import the ToggleSwitch component
import axios from 'axios';

const NavBar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { logout, isAdmin, userId } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [picture, setPicture] = useState('https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png');

  useEffect(() => {
    const getUserPic = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/users/${userId}`);
        setPicture(response.data.profilePic);
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getUserPic();
  }, [userId]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAdmin = () => {
    navigate('/admin');
  };

  const handleMouseEnter = () => {
    setIsBubbleVisible(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsBubbleVisible(false);
    }, 500); // Keep the bubble open for half a second
  };

  return (
    <div className={`nav-bar ${theme}`}>
      <img
        className="nav-logo"
        src='https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'
        alt="Netflix Logo"
        onClick={handleLogoClick}
      />
      <Search onSearch={onSearch} /> {/* Include the Search component */}
      {isAdmin && <button className='admin-button' onClick={handleAdmin}>Admin page</button>}
      <ToggleSwitch isOn={theme === 'dark'} handleToggle={toggleTheme} />
      <div
        className="nav-avatar-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {console.log(picture)}
        <img
          className="nav-avatar"
          src='https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
          alt="User Avatar"
        />
        <div className={`nav-avatar-bubble ${isBubbleVisible ? 'visible' : ''}`}>
          <p>Profile</p>
          <p>Settings</p>
          <p onClick={handleLogout} className="logout-link">Logout</p>
        </div>
      </div>
    </div>
  );
};

export default NavBar;