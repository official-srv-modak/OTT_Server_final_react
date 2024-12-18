import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/BSLogo_transparent.png';
import search_icon from '../../assets/search_icon.svg';
import bell_icon from '../../assets/bell_icon.png';
import profile_icon from '../../assets/profile_icon.png';
import caret_icon from '../../assets/caret_icon.png';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [username, setUsername] = useState("");
  const authUrl = import.meta.env.VITE_SPRING_AUTH_URL;
  const signOutUrl = import.meta.env.VITE_SPRING_SIGN_OUT_URL;
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem('selectedProfile'));

  const authenticate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await response.json();

      if (data.status === "OK") {
        localStorage.setItem("user", JSON.stringify(data.user));
        return true; // Return true if authentication is successful
      } else {
        navigate('/Login');
        return false; // Return false if authentication fails
      }
    } catch (error) {
      navigate('/Login');
      console.error("Error during authentication:", error);
      return false; // Return false in case of an error
    }
  };

  const handleAuthentication = async () => {
    const isAuthenticated = await authenticate();
    if (isAuthenticated) {
      console.log("User is authenticated");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser); // Parse the JSON string
        setUsername(parsedUser.username); // Access the username property
      }
    } else {
      console.log("Authentication failed");
      navigate('/Login'); // Redirect to the home page on successful authentication
    }
  };

  const signOut = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(signOutUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (response.ok) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setUsername("");
        navigate('/Login');
      } else {
        alert("Sign-out failed.");
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };


  useEffect(() => {


    handleAuthentication()

  }, []);

  const handleTileClickSearch = (profile) => {
    // if (profile && profile.first_name) { // Check if profile and profile.first_name exist
    //   navigate('/search', { state: { username: profile.first_name } }); // Pass username in state
    // } else {
    //   console.warn('Profile data is empty or missing first name.');
    // }
    navigate('/search');
  };


  return (
    <div className='navbar'>
      <div className="navbar-left">
        <img src={logo} alt="Logo" />
        <ul>
          <li><Link to="/general">Home</Link></li>
          <li className="dropdown-menu">
            Categories
            <div className="dropdown-content">
              <Link to="/">OTT Server</Link>
              <Link to="/movies">Movies</Link>
              <Link to="/navy">Navy</Link>
              <Link to="/army">Army</Link>
              <Link to="/airforce">Air Force</Link>
              <Link to="/categories/horror">ANO</Link>
              <Link to="/categories/scifi">Live Events</Link>
              <Link to="/ebooks">Ebooks</Link>
              <Link to="/exam">Exam</Link>
              <Link to="/categories/misc">Misc</Link>
            </div>
          </li>
        </ul>

      </div>
      <div className="navbar-right">
        <img src={search_icon} alt="Search Icon" className='icons' onClick={() => handleTileClickSearch(profile)} />
        {/* <p><ul>
          <li><Link to="/profiles">Profiles</Link></li>
        </ul></p> */}
        {/* <img src={bell_icon} alt="Notifications" className='icons' /> */}
        <div className="navbar-profile">
          <img src={profile_icon} alt="Profile Icon" className='profile' />
          <img src={caret_icon} alt="Caret Icon" />
          <div className="dropdown">
            {username ? (
              <>
                <span>{username}</span>
                <p></p>
                <p><button onClick={signOut}>Sign Out</button></p>
              </>
            ) : (
              <Link to="/Login">Sign in</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
