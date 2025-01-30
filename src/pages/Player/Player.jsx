import React, { useState, useEffect, useRef } from 'react';
import './Player.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import CommentApp from '../../components/Comments/CommentApp';
import Navbar from '../../components/Navbar/Navbar';

const Player = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [videoUrl, setVideoUrl] = useState("");
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLeaving, setIsLeaving] = useState(false);
    const hasInteracted = useRef(false);


    const videoStreamUrl = import.meta.env.VITE_SPRING_VIDEO_STREAM_BASIC_URL;
    const recPosUrl = import.meta.env.VITE_RECORD_POSITION;
    const vidId = location.state?.id;

    useEffect(() => {
        if (videoStreamUrl && location.state && location.state.id && !videoUrl) {
            window.scrollTo(0, 0);
            setVideoUrl(`${videoStreamUrl}/${location.state.id}/false?resolution=auto&start=${location.state.pos || 0}`);
        } else {
            console.error("No video URL or ID provided");
        }

        const handleBeforeUnload = (e) => {
            if (hasInteracted.current && currentTime > 0 && duration > 0 && !isLeaving) {
                setIsLeaving(true);
                savePosition();
                // e.preventDefault(); // Use with caution
                // e.returnValue = ''; // For Chrome if preventDefault is used
            }
        };

        const handleUnload = () => {
            if (hasInteracted.current && currentTime > 0 && duration > 0 && !isLeaving) {
                savePosition(); // Try to save on unload as well
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && hasInteracted.current && currentTime > 0 && duration > 0 && !isLeaving) {
                savePosition();
            }
        };

        const handleBlur = () => {
            if (hasInteracted.current && currentTime > 0 && duration > 0 && !isLeaving) {
                savePosition();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        const handleRouteChange = () => {
            if (hasInteracted.current && currentTime > 0 && duration > 0 && !isLeaving) {
                savePosition();
            }
        };

        window.addEventListener('routeChange', handleRouteChange);

        const navigateWrapper = (path) => {
            handleRouteChange();
            navigate(path);
        };

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('routeChange', handleRouteChange);
        };
    }, [videoStreamUrl, location, currentTime, duration, isLeaving]);

    const savePosition = () => {
        const storedUser = localStorage.getItem("user");
        let username = "";
        if (storedUser) {
            username = JSON.parse(storedUser).username;
        }

        fetch(`${recPosUrl}${username}&show=${encodeURIComponent(location.state?.id)}&pos=${currentTime}&duration=${duration}&cause=user&name=${encodeURIComponent(location.state?.name)}&id=${location.state?.id}`, {
            method: 'POST'
        }).then(response => {
            if (!response.ok) {
                console.error("Failed to save video position");
            }
        }).catch(err => {
            console.error("Error while saving video position:", err);
        }).finally(() => {
            setIsLeaving(false);
        });
    };

    const handleTimeUpdate = (e) => {
        setCurrentTime(e.target.currentTime);
        hasInteracted.current = true;
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

    const handleNavigation = () => {
        navigateWrapper(-1);
    };

    return (
        <>
            <Navbar />
            <div className='player'>
                <div className="player-info">
                    <p className='b'>{location.state ? location.state.name : "Movie"}</p>
                </div>
                {videoUrl ? (
                    <video
                        key={videoUrl}
                        controls
                        autoPlay
                        width="100%"
                        height="auto"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onError={handleError}
                    >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <p>Loading video...</p>
                )}
                <button onClick={handleNavigation}>Back</button>
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