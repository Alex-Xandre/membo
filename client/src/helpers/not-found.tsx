// src/layout/NotFound.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-center h-screen text-center flex-col w-screen'>
      <h1 className='text-4xl font-bold text-gray-800'>404</h1>
      <p className='mt-4 text-lg text-gray-600'>Page Not Found</p>
      <button className='underline mt-5' onClick={() =>{
        navigate("/")
      }}>back to Home</button>
    </div>
  );
};

export default NotFound;
