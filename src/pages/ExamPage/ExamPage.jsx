import React from 'react';
import { Link } from 'react-router-dom'; // Link for navigation
import './ExamPage.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import logo from '../../assets/logo.png';

const examImages = [

  {
    "id": 1,
    "title": "NCC Certificate A",
    "description": "This certificate is awarded after the successful completion of basic training in the National Cadet Corps, focusing on discipline, leadership, and physical fitness.",
    "url": "http://localhost/images/logo.png"
  },
  {
    "id": 2,
    "title": "NCC Certificate B",
    "description": "Awarded after intermediate training, it recognizes cadets who have participated in advanced camps and have demonstrated leadership and dedication to community service.",
    "url": "http://localhost/images/logo.png"
  },
  {
    "id": 3,
    "title": "NCC Certificate C",
    "description": "This certificate is awarded after the completion of advanced training, which includes leadership, military training, and national service activities, as well as participation in national camps.",
    "url": "http://localhost/images/logo.png"
  }


];

const ExamPage = () => {
  return (
    <div className="exam-page">
      <Navbar />
      <div className="exam-page-content">
        <img src={logo} alt="Logo" className="navbar-logo-mobile" />
        <h1 className="exam-page-title">NCC Certification exam</h1>
        <div className="exam-collage">
          {examImages.map((image) => (
            <Link key={image.id} className="exam-collage-tile">
              <img src={image.url} alt={image.title} className="exam-collage-image" />
              <h3>{image.title}</h3>
              <p className="exam-result-description">{image.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExamPage;
