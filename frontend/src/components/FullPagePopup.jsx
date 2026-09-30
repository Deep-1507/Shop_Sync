import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import checkmarkGif from '../assets/Checked.gif';
import sound from '../assets/notif.mp3';

const FullPagePopup = ({ message, duration, navigateTo }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const navigateTimer = setTimeout(() => {
      navigate(navigateTo);
    }, duration);

    return () => {
      clearTimeout(navigateTimer);
    };
  }, [duration, navigate, navigateTo]);

  useEffect(() => {
    const audio = new Audio(sound);
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 transition-opacity duration-300 opacity-100">
      <div className="bg-walmartblue text-white text-center p-8 rounded-lg text-lg shadow-2xl space-y-6 transition-transform transform scale-100 hover:scale-105">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-72 h-72 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img src= {checkmarkGif} alt="Success" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="transition-opacity duration-1000">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPagePopup;
