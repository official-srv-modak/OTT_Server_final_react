import React, { useState, useEffect } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import CommentApp from '../../components/Comments/CommentApp';
import Navbar from '../../components/Navbar/Navbar';
import logo from '../../assets/logo.png';


const Player = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [videoUrl, setVideoUrl] = useState("");
    const [currentTime, setCurrentTime] = useState(0); // Track the current time of the video
    const [duration, setDuration] = useState(0); // Track video duration
    const [isLeaving, setIsLeaving] = useState(false); // State to control multiple calls

    // Ensure VITE_SPRING_VIDEO_STREAM_URL is correctly set in your environment variables
    // const videoStreamUrl = import.meta.env.VITE_SPRING_VIDEO_STREAM_URL_V2;
    const videoStreamUrl = import.meta.env.VITE_SPRING_VIDEO_STREAM_URL;
    const recPosUrl = import.meta.env.VITE_RECORD_POSITION;
    const vidId = location.state?.id;

    useEffect(() => {
        // Prevent page reload handling

        if (videoStreamUrl && location.state && location.state.id && !videoUrl) {
            window.scrollTo(0, 0);
            setVideoUrl(`${videoStreamUrl}/${location.state.id}?resolution=auto&start=${location.state.pos || 0}`);
            // setVideoUrl(`${videoStreamUrl}/${location.state.id}?resolution=720p&start=${location.state.pos || 0}`);
        } else {
            console.error("No video URL or ID provided");
        }

        const handleUnload = () => {
            if (!isLeaving && currentTime > 0 && duration > 0) {
                setIsLeaving(true); // Prevent multiple API calls
                const storedUser = localStorage.getItem("user");
                let username = "";
                if (storedUser) {
                    let parsedUser = JSON.parse(storedUser); // Parse the JSON string
                    username = parsedUser.username;
                }
                // Replace this fetch call with axios or another library if preferred
                fetch(`${recPosUrl}${username}&show=${encodeURIComponent(location.state?.id)}&pos=${currentTime}&duration=${duration}&cause=user&name=${encodeURIComponent(location.state?.name)}&id=${location.state?.id}`, {
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
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [videoStreamUrl, location, currentTime, duration, isLeaving]);

    const handleTimeUpdate = (e) => {
        setCurrentTime(e.target.currentTime);
    };

    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    };

    const handleError = (e) => {
        const videoElement = e.target;
        console.error("Video playback error triggered:", e);
        console.error("Video element error object:", videoElement.error);

        if (videoElement.error) {
            console.error("Error code:", videoElement.error.code);
            console.error("Error message:", videoElement.error.message);
        } else {
            console.error("An unknown error occurred with the video playback.");
        }
    };


    return (
        <>
            <Navbar />
            <div className='player'>
                {/* Display the movie name and type in the top left */}
                {videoUrl ? (
                    <video
                        key={videoUrl}
                        controls
                        autoPlay
                        width="100%"
                        height="auto"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onError={handleError} // Add the error handler here
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
            {videoStreamUrl ? (
                <CommentApp postId={vidId} />
            ) : (
                <p>Loading comments...</p>
            )}

            <Footer />
        </>
    );
};

export default Player;
