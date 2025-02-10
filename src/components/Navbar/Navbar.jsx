import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search_icon.svg';
import profile_icon from '../../assets/profile_icon.png';
import caret_icon from '../../assets/caret_icon.png';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ flag }) => {
  const [username, setUsername] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const authUrl = import.meta.env.VITE_SPRING_AUTH_URL;
  const signOutUrl = import.meta.env.VITE_SPRING_SIGN_OUT_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const handleAuthentication = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(authUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: apiKey },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (data.status === 'OK') {
          localStorage.setItem('user', JSON.stringify(data.user));
          setUsername(data.user.username || 'User');
        } else {
          navigate('/Login');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/Login');
      }
    };

    handleAuthentication();
  }, [authUrl, navigate]);

  const signOut = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(signOutUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: apiKey },
        body: JSON.stringify({ token }),
      });
      if (response.ok) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUsername('');
        navigate('/Login');
      } else {
        alert('Sign-out failed.');
      }
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="navbar-logo" />
          {flag !== 1 && (
            <button className="hamburger" onClick={toggleMenu}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          )}
        </div>
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {flag !== 1 && (
            <>
              <li><Link to="/general" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/" onClick={closeMenu}>Study Materials</Link></li>
              {/* <li><Link to="/navy" onClick={closeMenu}>Navy</Link></li>
              <li><Link to="/army" onClick={closeMenu}>Army</Link></li>
              <li><Link to="/airforce" onClick={closeMenu}>Air Force</Link></li>
              <li><Link to="/categories/horror" onClick={closeMenu}>ANO</Link></li>
              <li><Link to="/categories/scifi" onClick={closeMenu}>Live Events</Link></li> */}
              <li><Link to="/ebooks" onClick={closeMenu}>Ebooks</Link></li>
              <li><Link to="/exam" onClick={closeMenu}>Exam</Link></li>
              <li><Link to="/categories/misc" onClick={closeMenu}>Live Events</Link></li>
            </>
          )}
        </ul>
        <div className="navbar-right">
          {flag !== 1 && (
            <img src={search_icon} alt="Search Icon" className="icons" onClick={() => { closeMenu(); navigate('/search'); }} />
          )}
          <div className="navbar-profile">
            <img src={profile_icon} alt="Profile Icon" className="profile" />
            <img src={caret_icon} alt="Caret Icon" />
            <div className="dropdown">
              {username ? (
                <>
                  <span>{username}</span><br />
                  <button onClick={signOut}>Sign Out</button>
                </>
              ) : (
                <Link to="/Login" onClick={closeMenu}>Sign in</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
