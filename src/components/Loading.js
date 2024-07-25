// src/components/Loading.js
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <CircularProgress size={60} />
    </div>
  );
};

export default Loading;
