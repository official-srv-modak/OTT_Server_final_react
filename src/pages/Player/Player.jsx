import React, { useState, useEffect } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../../components/Footer/Footer'
import CommentApp from '../../components/Comments/CommentApp';

const Player = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [videoUrl, setVideoUrl] = useState("");

    // Ensure VITE_SPRING_VIDEO_STREAM_URL is correctly set in your environment variables
    const videoStreamUrl = import.meta.env.VITE_SPRING_VIDEO_STREAM_URL;

    useEffect(() => {
        if (videoStreamUrl && location.state && location.state.id) {
            // Set the video URL only if both videoStreamUrl and id are available
            setVideoUrl(videoStreamUrl + '/' + location.state.id + '?resolution=auto');
        } else {
            console.error("No video URL or ID provided");
        }
    }, [location, videoStreamUrl]);

    return (
        <>
            <div className='player'>
                {/* Display the movie name and type in the top left */}

                {videoUrl ? (
                    <video
                        key={videoUrl}  // Force re-render when videoUrl changes
                        controls
                        autoPlay
                        width="100%"
                        height="auto"
                    >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <p>Loading video...</p>
                )}

                <div className="player-info">
                    <p className='b'>{location.state ? location.state.name : "Movie"}</p>
                </div>
            </div>
            <CommentApp postId={location.state?.id} />
            <Footer />
        </>
    );
}

export default Player;
