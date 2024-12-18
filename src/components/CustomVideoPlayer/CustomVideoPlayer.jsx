import React from 'react';
import ReactPlayer from 'react-player';

const CustomVideoPlayer = () => {
  return (
    <div className="video-wrapper">
      <ReactPlayer
        url="https://www.youtube.com/watch?v=QjWX3o3dNGg"
        controls={false} // Hide controls
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default CustomVideoPlayer;