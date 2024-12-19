import React, { useState, useEffect } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import CommentApp from '../../components/Comments/CommentApp';
import Navbar from '../../components/Navbar/Navbar';

const Player = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [videoUrl, setVideoUrl] = useState("");
    const [currentTime, setCurrentTime] = useState(0); // Track the current time of the video
    const [duration, setDuration] = useState(0); // Track video duration

    // Ensure VITE_SPRING_VIDEO_STREAM_URL is correctly set in your environment variables
    const videoStreamUrl = import.meta.env.VITE_SPRING_VIDEO_STREAM_URL;

    useEffect(() => {
        //window.scrollTo(0, 0);
        if (videoStreamUrl && location.state && location.state.id) {
            // Set the video URL only if both videoStreamUrl and id are available
            setVideoUrl(videoStreamUrl + '/' + location.state.id + '?resolution=auto');
        } else {
            console.error("No video URL or ID provided");
        }

        const handleUnload = () => {
            if (currentTime > 0 && duration > 0) {
                const storedUser = localStorage.getItem("user");
                let username = ""
                if (storedUser) {
                    let parsedUser = JSON.parse(storedUser); // Parse the JSON string
                    username = parsedUser.username;
                }
                // Replace this fetch call with axios or another library if preferred
                fetch(`http://localhost/record_position.php?username=${username}&show=${encodeURIComponent(location.state?.id)}&pos=${currentTime}&duration=${duration}&cause=user&name=${encodeURIComponent(location.state?.name)}&id=${location.state?.id}`, {
                    method: 'POST'
                }).then(response => {
                    if (!response.ok) {
                        console.error("Failed to save video position");
                    }
                }).catch(err => {
                    console.error("Error while saving video position:", err);
                });
            }
        };

        // Add event listeners
        window.addEventListener("beforeunload", handleUnload);
        return () => {
            // Cleanup
            handleUnload();
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [videoStreamUrl, location, currentTime, duration]);

    const handleTimeUpdate = (e) => {
        setCurrentTime(e.target.currentTime);
    };

    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    };

    return (
        <>
            <Navbar />
            <div className='player'>
                {/* Display the movie name and type in the top left */}

                {videoUrl ? (
                    <video
                        key={videoUrl}  // Force re-render when videoUrl changes
                        controls
                        autoPlay
                        width="100%"
                        height="auto"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
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
};

export default Player;
