import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './LiveEvents.css';

const LiveEvents = () => {
    return (
        <div className="live-events">
            <h1 className='live-page-title'>Live Events</h1>
            <Navbar />
            <div className="video-grid">
                <div className="video-wrapper">
                    <iframe
                        src="https://www.youtube.com/embed/oTc2uoDYuro?autoplay=1"
                        title="WION Live"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="video-wrapper">
                    <iframe
                        src="https://www.youtube.com/embed/Z9UOGS24zuo?autoplay=1"
                        title="Republic Bharat Live"
                        frameBorder="0"
                        allow="encrypted-media"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LiveEvents;
