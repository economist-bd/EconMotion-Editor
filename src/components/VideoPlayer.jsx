import React, { useRef, useEffect } from 'react';
import TextLayer from './TextLayer';

const VideoPlayer = ({ videoSrc, layers, currentTime, setCurrentTime, isPlaying, setIsPlaying, containerRef }) => {
  const videoRef = useRef(null);

  // প্লে/পজ কন্ট্রোল
  useEffect(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
  }, [isPlaying]);

  // ভিডিওর সময় আপডেট করা
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  return (
    // এই containerRef টি খুব গুরুত্বপূর্ণ, এটিকেই আমরা রেকর্ড করব
    <div className="video-container" ref={containerRef}>
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          controls={false} // আমরা নিজস্ব কন্ট্রোল ব্যবহার করব (যদি লাগে)
          onClick={() => setIsPlaying(!isPlaying)} // ভিডিওতে ক্লিক করলে প্লে/পজ
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <div style={{height: '100%', display:'flex', justifyContent:'center', alignItems:'center', color:'#555'}}>
          No Video Loaded
        </div>
      )}

      {/* সব টেক্সট লেয়ার এখানে রেন্ডার হবে */}
      {layers.map((layer) => (
        <TextLayer key={layer.id} layer={layer} currentTime={currentTime} />
      ))}
    </div>
  );
};

export default VideoPlayer;