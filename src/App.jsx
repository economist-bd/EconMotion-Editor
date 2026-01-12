import React, { useState, useRef } from 'react';
import './styles/App.css';
import EditorSidebar from './components/EditorSidebar';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const [videoSrc, setVideoSrc] = useState(null);
  const [layers, setLayers] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const videoContainerRef = useRef(null); // যে ডিভটি রেকর্ড করব
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // ১. ভিডিও আপলোড হ্যান্ডলার
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      // রিসেট
      setLayers([]);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  // ২. লেয়ার ম্যানেজমেন্ট
  const handleAddLayer = (newLayer) => {
    setLayers([...layers, { ...newLayer, id: Date.now() }]);
  };
  const handleDeleteLayer = (id) => {
    setLayers(layers.filter(layer => layer.id !== id));
  };

  // ৩. ফাইনাল ভিডিও রেকর্ডিং লজিক (সবচেয়ে গুরুত্বপূর্ণ অংশ)
  const handleRecordToggle = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      // ব্রাউজারের কাছে স্ক্রিন শেয়ার করার পারমিশন চাওয়া
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" }, // আমরা শুধু ব্রাউজার ট্যাব রেকর্ড করতে চাই
        audio: true, // ট্যাবের অডিও সহ (ভিডিওর সাউন্ড)
        selfBrowserSurface: "include"
      });

      recordedChunksRef.current = [];
      // MediaRecorder সেটআপ (উচ্চ মানের জন্য VP9 কোডেক চেষ্টা করা হচ্ছে)
      const options = { mimeType: 'video/webm; codecs=vp9,opus' };
      const mediaRecorder = new MediaRecorder(stream, MediaRecorder.isTypeSupported(options.mimeType) ? options : undefined);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = downloadRecordedVideo;

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
      // রেকর্ডিং শুরু হলে ভিডিও অটোমেটিক প্লে হবে
      setCurrentTime(0);
      setIsPlaying(true);

      // ইউজার যদি ব্রাউজারের নেটিভ "Stop Sharing" বাটনে ক্লিক করে
      stream.getVideoTracks()[0].onended = () => {
        if (isRecording) stopRecording();
      };

    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not start recording. Please ensure you select the correct tab and grant permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsPlaying(false);
      setIsRecording(false);
       // স্ট্রীমের ট্র্যাকগুলো বন্ধ করা
       mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const downloadRecordedVideo = () => {
    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'econ-motion-export.webm'; // WebM ফরম্যাটে সেভ হবে (YouTube এ আপলোড যোগ্য)
    a.click();
    window.URL.revokeObjectURL(url);
    recordedChunksRef.current = [];
    alert("Video processed and downloaded! Check your downloads folder.");
  };


  return (
    <div className="app-container">
      <EditorSidebar 
        onVideoUpload={handleVideoUpload}
        onAddLayer={handleAddLayer}
        layers={layers}
        onDeleteLayer={handleDeleteLayer}
        currentTime={currentTime}
        onStartRecording={handleRecordToggle}
        isRecording={isRecording}
      />
      <div className="workspace">
        <VideoPlayer 
          videoSrc={videoSrc}
          layers={layers}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          containerRef={videoContainerRef}
        />
        {videoSrc && !isRecording && (
          <div style={{marginTop:'10px', color:'#aaa'}}>
             Time: {currentTime.toFixed(1)}s (Click video to Play/Pause)
          </div>
        )}
      </div>
    </div>
  );
}

export default App;