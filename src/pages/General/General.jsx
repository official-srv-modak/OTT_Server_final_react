import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './General.css';
import logo from '../../assets/logo.png';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

// Sample JSON data
const baseUrl = import.meta.env.VITE_BASE_URL;
const productData = {
    "product": {
        "name": "NCC Eduforce",
        "description": "NCC eduforce is a e-learning platform exclusively for NCC cadets, ANOs and units.It gives access to a wide range of learning resources, including lecture notes, videos, interactive assessments, Online exams/mock testes and discussion forums.",
        "features": [
            {
                "title": "OTT Server for Indian Armed Forces",
                "description": "NCC Eduforce is designed exclusively for NCC cadets, ANOs and units. It gives access to a wide range of learning resources, including lecture notes, videos, interactive assessments",
                "image": baseUrl+"sample_images/image1.jpg"
            },
            // {
            //     "title": "Intranet Only Usage",
            //     "description": "NCC Eduforce is intended to be used over an intranet network only, ensuring high security and controlled access within the Armed Forces.",
            //     "image": baseUrl+"sample_images/image2.jpg"
            // },
            {
                "title": "Course Materials and Videos",
                "description": "A central location for accessing e-books, lecture notes, instructional multimedia content (videos, podcasts), and supplementary materials.",
                "image": baseUrl+"sample_images/image3.jpg"
            },
            {
                "title": "Ebooks and Learning Resources",
                "description": "NCC Eduforce provides a collection of ebooks and other digital learning resources for the Indian Armed Forces personnel.",
                "image": baseUrl+"sample_images/image4.jpg"
            },
            {
                "title": "Live Events",
                "description": "Stay up to date with live events, including training sessions, briefings, and other important announcements relevant to the Indian Armed Forces.",
                "image": baseUrl+"sample_images/image5.jpg"
            },
            {
                "title": "General Information about the Indian Armed Forces",
                "description": "In today’s rapidly evolving educational landscape, it is crucial that schools and NCC harness the power of technology to enhance student learning experiences. With this in mind, I have developed an innovative e-learning application specifically designed for the NCC cadets. This platform seeks to address the current challenges in traditional education by offering a digital solution that fosters more interactive, engaging, quality and personalized learning.",
                "image": baseUrl+"sample_images/image6.svg"
            }
        ],
        "target_audience": "NCC Units, Cadets, and ANOs",
        "deployment": "India Only",
        "security": "High security with controlled access"
    }
};

const General = () => {
    const [product, setProduct] = useState(null);

    // Simulating data fetching
    useEffect(() => {
        window.scrollTo(0, 0);
        setProduct(productData.product); // In a real scenario, fetch the data from an API
    }, []);

    if (!product) {
        return <div>Loading...</div>; // Show loading text while the data is being fetched
    }

    return (
        <div className="new-page">
            <Navbar />
            <div className="page-content">
                <img src={logo} alt="Logo" className="navbar-logo-mobile" />
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <br></br>
                <div className="features-wrapper">
                    {product.features.map((feature, index) => (
                        <div key={index} className="general-result-tile-wrapper">
                            <h3 className="general-result-title">{feature.title}</h3>
                            <div className="general-result-tile">
                                <img src={feature.image} alt={feature.title} className="general-result-image" />
                                <div className="general-result-content">
                                    <p className="general-result-description">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="product-details">
                    <p><strong>Target Audience:</strong> {product.target_audience}</p>
                    <p><strong>Deployment:</strong> {product.deployment}</p>
                    <p><strong>Security:</strong> {product.security}</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default General;
