import React from 'react';
import { Link } from 'react-router-dom'; // Link for navigation
import './NavyPage.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const navyImages = [
  {
    id: 1,
    title: "INS Vikrant",
    description: "India's first indigenously built aircraft carrier, symbolizing self-reliance.",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/INS_VIkrant_%28R11%29_underway_in_the_Arabian_Sea_with_4_Mig-29K_Fighter_Jet_performing_flypast.jpg"
  },
  {
    id: 2,
    title: "Submarine Fleet",
    description: "The stealth power of the Indian Navy, patrolling the depths.",
    url: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202405/submarine-0341227-16x9_0.jpg?VersionId=OFMinkIfihK.AxRYPOu0YFfvWG7pnpRw&size=690:388"
  },
  {
    id: 3,
    title: "Marine Commandos",
    description: "The elite force, always ready for high-risk operations.",
    url: "https://www.hindustantimes.com/ht-img/img/2024/01/05/550x309/marco_1704474160520_1704474170179.png"
  },
  {
    id: 4,
    title: "Naval Aviation",
    description: "The eyes of the fleet, always vigilant in the skies.",
    url: "https://airpowerasia.com/wp-content/uploads/2022/01/3d-render-of-tedbf-by-satwik-40i_m_satwikk-twitter.jpg"
  }
];

const NavyPage = () => {
  return (
    <div className="navy-page">
      <Navbar />
      <div className="navy-page-content">
        <h1 className="navy-page-title">Indian Navy - Guardians of the Sea</h1>
        <div className="navy-collage">
          {navyImages.map((image) => (
                        // <Link key={image.id} to={`/navy/${image.id}`} className="navy-collage-tile">

            <Link key={image.id} className="navy-collage-tile">
              <img src={image.url} alt={image.title} className="navy-collage-image" />
              <h3>{image.title}</h3>
              <p className="navy-result-description">{image.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NavyPage;
