import React, { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const profilesUrl = import.meta.env.VITE_GET_PROFILES;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(profilesUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const textData = await response.text(); // Get the response as text
        const data = JSON.parse(textData); // Parse the string as JSON
        setProfiles(data.cards); // Use the parsed JSON data
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleTileClick = (profile) => {
    localStorage.setItem('selectedProfile', JSON.stringify(profile));
    navigate('/'); // Navigate to the homepage on click
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-content">
        {loading ? (
          <p>Loading profiles...</p>
        ) : profiles.length > 0 ? (
          profiles.map((profile, index) => (
            <div key={index} className="profile-tile" onClick={() => handleTileClick(profile)}>
              <h3>{`${profile.first_name} ${profile.last_name}`}</h3>
            </div>
          ))
        ) : (
          <p>No profiles found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
