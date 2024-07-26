import React from 'react';
import TicTacToe from '../components/TicTacToe';
import FlappyBird from '../components/Flappybird';

function NotFoundPage() {
  return (
    <div className="container mx-auto mt-8 text-center">
      <h1 className="text-4xl font-bold mb-8">404 - Page Not Found</h1>
      <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
     <FlappyBird/>
     
    </div>
  );
}

export default NotFoundPage;