import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App: React.FC = () => {
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSpeedOptionsVisible, setSpeedOptionsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLButtonElement>(null);
  const speedOptionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const video = videoRef.current!;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedData = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  const formatTime = (time: number): string => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedHours = hours < 10 ? `0${hours}` : hours;

    if (hours === 0) {
      return `${formattedMinutes}:${formattedSeconds}`;
    }
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const handlePlayPause = () => {
    const video = videoRef.current!;
    setPlaying((prevState) => !prevState);

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const timelineWidth = progressBarRef.current!.clientWidth;
    const clickPosition = e.nativeEvent.offsetX;
    const percent = (clickPosition / timelineWidth) * videoRef.current!.duration;
    videoRef.current!.currentTime = percent;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current!;
    video.volume = parseFloat(e.target.value);

    if (e.target.value === '0') {
      volumeRef.current!.classList.replace('fa-volume-high', 'fa-volume-xmark');
    } else {
      volumeRef.current!.classList.replace('fa-volume-xmark', 'fa-volume-high');
    }
  };

  const handleSpeedOptionClick = (speed: number) => {
    const video = videoRef.current!;
    video.playbackRate = speed;
    setSpeedOptionsVisible(false);
  };

  const handleToggleSpeedOptions = () => {
    setSpeedOptionsVisible(!isSpeedOptionsVisible);
  };

  const handleFullScreen = () => {
    const container = document.querySelector('.container') as HTMLElement;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  return (
    <div className="container show-controls">
      <div className="wrapper">
        <div className="video-timeline" onClick={handleTimelineClick}>
          <div className="progress-area">
            <span>00:00</span>
            <div className="progress-bar" ref={progressBarRef}></div>
          </div>
        </div>
        <ul className="video-controls">
          <li className="options left">
            <button className="volume" ref={volumeRef}>
              <i className="fa-solid fa-volume-high"></i>
            </button>
            <input type="range" min="0" max="1" step="any" onChange={handleVolumeChange} />
            <div className="video-timer">
              <p className="current-time">{formatTime(currentTime)}</p>
              <p className="separator"> / </p>
              <p className="video-duration">{formatTime(duration)}</p>
            </div>
          </li>
          <li className="options center">
            <button className="skip-backward">
              <i className="fas fa-backward"></i>
            </button>
            <button className="play-pause" onClick={handlePlayPause}>
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <button className="skip-forward">
              <i className="fas fa-forward"></i>
            </button>
          </li>
          <li className="options right">
            <div className="playback-content">
              <button className="playback-speed" onClick={handleToggleSpeedOptions}>
                <span className="material-symbols-rounded">slow_motion_video</span>
              </button>
              {isSpeedOptionsVisible && (
                <ul className="speed-options" ref={speedOptionsRef}>
                  <li onClick={() => handleSpeedOptionClick(2)}>2x</li>
                  <li onClick={() => handleSpeedOptionClick(1.5)}>1.5x</li>
                  <li onClick={() => handleSpeedOptionClick(1)} className="active">
                    Normal
                  </li>
                  <li onClick={() => handleSpeedOptionClick(0.75)}>0.75x</li>
                  <li onClick={() => handleSpeedOptionClick(0.5)}>0.5x</li>
                </ul>
              )}
            </div>
            <button className="pic-in-pic">
              <span className="material-icons">picture_in_picture_alt</span>
            </button>
            <button className="fullscreen" onClick={handleFullScreen}>
              <i className="fa-solid fa-expand"></i>
            </button>
          </li>
        </ul>
      </div>
      <video src="src/assets/demo-video.mp4" ref={videoRef}></video>
    </div>
  );
};

export default App;
