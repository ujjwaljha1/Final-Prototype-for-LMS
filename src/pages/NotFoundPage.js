import React from 'react';
import TicTacToe from '../components/TicTacToe';

function NotFoundPage() {
  return (
    <div className="container mx-auto mt-8 text-center">
      <h1 className="text-4xl font-bold mb-8">404 - Page Not Found</h1>
      <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
      <h2 className="text-2xl font-semibold mb-4">While you're here, why not play a game of Tic-Tac-Toe?</h2>
      <TicTacToe />
    </div>
  );
}

export default NotFoundPage;