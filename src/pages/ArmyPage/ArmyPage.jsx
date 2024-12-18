import React from 'react';
import { Link } from 'react-router-dom'; // Link for navigation
import './ArmyPage.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const armyImages = [
  {
    id: 1,
    title: "Indian Army Tanks",
    description: "The backbone of the Indian Army's armored corps.",
    url: "https://thedefensepost.com/wp-content/uploads/2017/11/Indian-Army-T-72.jpg"
  },
  {
    id: 2,
    title: "Special Forces",
    description: "Elite units performing covert and high-risk operations.",
    url: "https://i.redd.it/1hvdh69eleqa1.jpg"
  },
  {
    id: 3,
    title: "Artillery",
    description: "The might of the Indian Army's firepower.",
    url: "https://armyrecognition.com/templates/yootheme/cache/b9/India_Launches_Major_Call_for_Tender_to_Acquire_Advanced_Lightweight_Artillery_Guns_001-b92c04f8.webp"
  },
  {
    id: 4,
    title: "Paratroopers",
    description: "Always ready to be deployed from the skies.",
    url: "https://www.ssbcrack.com/wp-content/uploads/2019/09/14-2-1024x683.jpg"
  }
];

const ArmyPage = () => {
  return (
    <div className="army-page">
      <Navbar />
      <div className="army-page-content">
        <h1 className="army-page-title">Indian Army - Defenders of the Land</h1>
        <div className="army-collage">
          {armyImages.map((image) => (
            <Link key={image.id} className="army-collage-tile">
              <img src={image.url} alt={image.title} className="army-collage-image" />
              <h3>{image.title}</h3>
              <p className="army-result-description">{image.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArmyPage;
