import React, { useState, useEffect } from 'react';

const DateAndTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCircleVisible, setIsCircleVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Toggle visibility every second for demonstration purposes
    const toggleVisibility = setInterval(() => {
      setIsCircleVisible((prev) => !prev);
    }, 1000);

    return () => clearInterval(toggleVisibility);
  }, []);

  const formatDayAndMonth = (date) => {
    const options = { day: '2-digit', month: 'short' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const [day, month] = formattedDate.split(' ');
    return `${day} ${month.toUpperCase()}`;
  };

  const formatYear = (date) => date.getFullYear();

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatDayOfWeek = (date) => date.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
 
  return (
    <div className="relative flex flex-row w-full items-center  rounded-br-xl shadow-xl">
      <div className="flex flex-col bg-sky-900 text-white space-y-1 rounded-tl-xl mt-1 pr-7 ">
        <div className='mt-5'>
        <div className="text-2xl font-bold m-6 mb-0 ">{formatDayAndMonth(currentTime)}</div>
        <div className="font-extralight text-4xl m-6 mt-0">{formatYear(currentTime)}</div>
        </div>
       
      </div>
      <div className="flex flex-col space-y-1 pl-8 pb-2">
        <div className="text-xl font-semibold m-6 mb-0">{formatTime(currentTime)}</div>
        <div className="text-4xl font-extralight m-6 mb-0">{formatDayOfWeek(currentTime)}</div>
      </div>
      <div
        className={`absolute left-40 transform -translate-x-1/2 ${
          isCircleVisible ? 'bg-black bg-opacity-45' : 'bg-white bg-opacity-0'
        } z-50  transition-opacity duration-300 opacity-${isCircleVisible ? '100' : '0'} w-20 h-20 rounded-full shadow-sm`}
      ></div>
    </div>
  );
};

export default DateAndTime;
