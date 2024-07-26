import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

const FlappyBird = () => {
  const canvasRef = useRef(null);
  const birdRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const birdState = useRef({
    x: 50,
    y: 200,
    width: 34,
    height: 24,
    velocity: 0,
    gravity: 0.6,
    jump: -10,
    rotation: 0,
  });

  const gameState = useRef({
    pipes: [],
    clouds: [],
    groundOffset: 0,
    pipeGap: 150,
    pipeInterval: 200, // Distance between pipes
    lastPipePosition: 400,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const gameLoop = () => {
      updateGameState();
      drawGame(ctx);
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    if (gameStarted) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted]);

  const updateGameState = () => {
    const bird = birdState.current;
    const game = gameState.current;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    bird.rotation = Math.min(Math.PI / 2, Math.max(-Math.PI / 2, bird.velocity * 0.1));

    // Prevent bird from going out of bounds
    if (bird.y > 380 - bird.height) {
      bird.y = 380 - bird.height;
      bird.velocity = 0;
    } else if (bird.y < 0) {
      bird.y = 0;
      bird.velocity = 0;
    }

    game.pipes.forEach((pipe, index) => {
      pipe.x -= 2;

      if (pipe.x + 50 < 0) {
        game.pipes.splice(index, 1);
        setScore((prevScore) => prevScore + 1);
      }

      if (
        bird.x < pipe.x + 50 &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
      ) {
        gameOver();
      }
    });

    game.clouds.forEach((cloud) => {
      cloud.x -= 0.5;
      if (cloud.x + cloud.width < 0) {
        cloud.x = 400;
        cloud.y = Math.random() * 200;
      }
    });

    game.groundOffset = (game.groundOffset - 2) % 20;

    if (game.lastPipePosition - game.pipes[game.pipes.length - 1]?.x >= game.pipeInterval) {
      addPipe();
    }
    if (game.clouds.length < 3) {
      addCloud();
    }
  };

  const drawGame = (ctx) => {
    const bird = birdState.current;
    const game = gameState.current;

    // Draw background
    ctx.fillStyle = '#70c5ce'; // Sky blue
    ctx.fillRect(0, 0, 400, 400);

    // Draw clouds
    ctx.fillStyle = '#ffffff'; // White for clouds
    game.clouds.forEach((cloud) => {
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.width / 2, 0, Math.PI * 2, true);
      ctx.fill();
    });

    // Draw pipes
    ctx.fillStyle = '#228B22'; // Green for pipes
    game.pipes.forEach((pipe) => {
      ctx.fillRect(pipe.x, 0, 50, pipe.top);
      ctx.fillRect(pipe.x, pipe.bottom, 50, 400 - pipe.bottom);
    });

    // Draw ground
    ctx.fillStyle = '#8B4513'; // Brown for ground
    ctx.fillRect(0, 380, 400, 20);
    ctx.fillRect(game.groundOffset + 400, 380, 400, 20);

    // Draw bird
    const birdElement = birdRef.current;
    if (birdElement) {
      birdElement.style.transform = `translate(${bird.x}px, ${bird.y}px) rotate(${bird.rotation}rad)`;
    }

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
  };


  const addPipe = () => {
    const game = gameState.current;
    const gap = game.pipeGap;
    const topHeight = Math.random() * (300 - gap) + 50;
    game.pipes.push({
      x: 400,
      top: topHeight,
      bottom: topHeight + gap,
    });
    game.lastPipePosition = 400;
  };


  const addCloud = () => {
    gameState.current.clouds.push({
      x: 400,
      y: Math.random() * 200,
      width: 60,
      height: 30,
    });
  };

  const gameOver = () => {
    setGameStarted(false);
    if (score > highScore) {
      setHighScore(score);
    }
    birdState.current = { ...birdState.current, y: 200, velocity: 0, rotation: 0 };
    gameState.current.pipes = [];
    gameState.current.clouds = [];
    setScore(0);
  };

  const handleClick = () => {
    if (!gameStarted) {
      setGameStarted(true);
      gameState.current.clouds = [
        { x: Math.random() * 400, y: Math.random() * 200, width: 60, height: 30 },
        { x: Math.random() * 400, y: Math.random() * 200, width: 60, height: 30 },
      ];
      gameState.current.lastPipePosition = 400;
      addPipe();
    } else {
      birdState.current.velocity = birdState.current.jump;
    }
  };
  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        onClick={handleClick}
      />
      <div
        className="bird"
        ref={birdRef}
        style={{ top: birdState.current.y, left: birdState.current.x }}
      />
      <p className="score">
        {gameStarted ? 'Click to jump!' : 'Click to start!'}
      </p>
      <p className="high-score">High Score: {highScore}</p>
    </div>
  );
};

export default FlappyBird;
