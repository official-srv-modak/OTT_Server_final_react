import React from 'react';
import { Link } from 'react-router-dom'; // Link for navigation
import './AirForcePage.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const airforceImages = [
  {
    id: 1,
    title: "Sukhoi Su-30MKI",
    description: "A twin-engine multirole fighter jet, backbone of the IAF.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/SU-30MKI-g4sp_-_edit_2%28clipped%29.jpg/600px-SU-30MKI-g4sp_-_edit_2%28clipped%29.jpg"
  },
  {
    id: 2,
    title: "Tejas Light Combat Aircraft",
    description: "Indigenous fighter aircraft of India, a symbol of innovation.",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/HAL_Tejas_%28LA-5018%29_of_Squadron_18_Flying_Bullets.jpg/1920px-HAL_Tejas_%28LA-5018%29_of_Squadron_18_Flying_Bullets.jpg"
  },
  {
    id: 3,
    title: "C-17 Globemaster III",
    description: "Strategic airlift capability of the Indian Air Force.",
    url: "https://bl-i.thgim.com/public/migration_catalog/article18026595.ece/alternates/LANDSCAPE_1200/boeingc17"
  },
  {
    id: 4,
    title: "Apache Helicopter",
    description: "Advanced combat helicopter, a game-changer in modern warfare.",
    url: "https://www.helicoptersmagazine.com/wp-content/uploads/2019/05/1200-IAF-apache-1024x683.jpg"
  }
];

const AirForcePage = () => {
  return (
    <div className="airforce-page">
      <Navbar />
      <div className="airforce-page-content">
        <h1 className="airforce-page-title">Indian Air Force - Warriors of the Sky</h1>
        <div className="airforce-collage">
          {airforceImages.map((image) => (
            <Link key={image.id} className="airforce-collage-tile">
              <img src={image.url} alt={image.title} className="airforce-collage-image" />
              <h3>{image.title}</h3>
              <p className="airforce-result-description">{image.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AirForcePage;
