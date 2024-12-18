import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './General.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

// Sample JSON data
const productData = {
    "product": {
        "name": "NavStream",
        "description": "NavStream is an OTT platform developed exclusively for the Indian Armed Forces. It provides access to course materials, videos, ebooks, live events, and general information about the Indian Armed Forces.",
        "features": [
            {
                "title": "OTT Server for Indian Armed Forces",
                "description": "NavStream is designed to serve as an OTT server exclusively for the Indian Armed Forces, providing secure and private access to essential resources.",
                "image": "http://localhost/sample_images/image1.webp"
            },
            {
                "title": "Intranet Only Usage",
                "description": "NavStream is intended to be used over an intranet network only, ensuring high security and controlled access within the Armed Forces.",
                "image": "http://localhost/sample_images/image2.jpg"
            },
            {
                "title": "Course Materials and Videos",
                "description": "All the course materials and educational videos are available in the OTT server for easy access by the personnel of the Indian Armed Forces.",
                "image": "http://localhost/sample_images/image3.jpg"
            },
            {
                "title": "Ebooks and Learning Resources",
                "description": "NavStream provides a collection of ebooks and other digital learning resources for the Indian Armed Forces personnel.",
                "image": "http://localhost/sample_images/image4.jpg"
            },
            {
                "title": "Live Events",
                "description": "Stay up to date with live events, including training sessions, briefings, and other important announcements relevant to the Indian Armed Forces.",
                "image": "http://localhost/sample_images/image5.jpg"
            },
            {
                "title": "General Information about the Indian Armed Forces",
                "description": "NavStream hosts general information about the Indian Armed Forces, including details about the Navy, Army, and Air Force, along with their course materials and any important notices.",
                "image": "http://localhost/sample_images/image6.svg"
            }
        ],
        "target_audience": "Indian Armed Forces personnel",
        "deployment": "Intranet-only usage",
        "security": "High security with controlled access"
    }
};

const General = () => {
    const [product, setProduct] = useState(null);

    // Simulating data fetching
    useEffect(() => {
        setProduct(productData.product); // In a real scenario, fetch the data from an API
    }, []);

    if (!product) {
        return <div>Loading...</div>; // Show loading text while the data is being fetched
    }

    return (
        <div className="new-page">
            <Navbar />
            <div className="page-content">
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
