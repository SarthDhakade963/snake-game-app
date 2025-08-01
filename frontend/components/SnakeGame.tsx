"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { TrophyIcon, PlayIcon, PauseIcon, RotateCcwIcon } from "lucide-react";
// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;
const MAX_SPEED = 50;
// Direction types
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
// Snake game component
const SnakeGame: React.FC = () => {
  // state's of the game
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // The HTMLCanvasElement interface provides properties and methods for manipulating the layout and presentation of canvas elements.
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Game state refs (to avoid closure issues in the game loop)
  const snakeRef = useRef([
    {
      x: 10,
      y: 10,
    },
  ]); // initial snake position

  const foodRef = useRef({
    x: 5,
    y: 5,
  }); // initial food position

  const directionRef = useRef<Direction>("RIGHT"); // random direction of snake head

  const speedRef = useRef(INITIAL_SPEED); // initial speed of screen refresh rate

  const lastRenderTimeRef = useRef(0); // last render time screen is refreshed at 0 initial

  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Initialize the game
  const initGame = useCallback(() => {
    snakeRef.current = [
      {
        x: 10,
        y: 10,
      },
    ];
    placeFood(); // places the food making sure that it is not placed on snake

    directionRef.current = "RIGHT"; // random head position at start

    speedRef.current = INITIAL_SPEED; // 100 is initial speed

    setScore(0); // initial score zero

    setGameOver(false); // game not over

    setIsPaused(false); // game is not paused
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Place food at random position
  const placeFood = () => {
    // random food position inside grid
    const food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Make sure food doesn't appear on snake
    const isOnSnake = snakeRef.current.some(
      (segment) => segment.x === food.x && segment.y === food.y
    );
    if (isOnSnake) {
      placeFood();
    } else {
      foodRef.current = food;
    }
  };

  // Main game loop
  const gameLoop = useCallback(
    (currentTime: number) => {
      if (gameOver || isPaused || !hasStarted) return;
      window.requestAnimationFrame(gameLoop); // calls the gameLoop function before the screen refreshes
      const secondsSinceLastRender =
        (currentTime - lastRenderTimeRef.current) / 1000; // gives the last time the screen refreshes
      if (secondsSinceLastRender < speedRef.current / 1000) return;
      lastRenderTimeRef.current = currentTime;
      if (!isPausedRef.current) {
        updateGame(); // updates the game
        drawGame();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameOver, isPaused, hasStarted]
  );

  // Start the game
  const startGame = useCallback(() => {
    // condition for when game has started or not started
    if (!hasStarted) {
      initGame(); // called the snake, place food, setscore(0), setGameOver(false) and setHasPaused(false)
      setHasStarted(true); // letting the game start
    } else {
      setIsPaused(false); // if game is not started then it is paused
    }

    lastRenderTimeRef.current = performance.now(); // it is used to record the exact time the last frame was rendered
    window.requestAnimationFrame(gameLoop); // calls game loop before screen refreshes
  }, [gameLoop, hasStarted, initGame]);

  // Update game state
  const updateGame = useCallback(() => {
    const snake = [...snakeRef.current]; // position of snake
    const food = foodRef.current; // food position
    const direction = directionRef.current; // direction of snake
    // Calculate new head position
    const head = {
      ...snake[0], // destructure the array and get only the head
    };
    // movement of snake
    switch (direction) {
      case "UP":
        head.y -= 1; // moves up by -1 to reference position of y
        break;
      case "DOWN":
        head.y += 1; // moves down by +1 to reference position of y
        break;
      case "LEFT":
        head.x -= 1; // moves left by -1 to reference positon of x
        break;
      case "RIGHT":
        head.x += 1; // moves right by +1 to reference position of x
        break;
    }
    // Check for collisions with walls
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    // Check for collisions with self
    // .some helps to access the snake body
    if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    // Add new head
    snake.unshift(head); // unshift adds new element to the start of an array
    // Check if food was eaten
    if (head.x === food.x && head.y === food.y) {
      // Increase score
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        // Increase speed with score
        speedRef.current = Math.max(
          MAX_SPEED,
          INITIAL_SPEED - newScore * SPEED_INCREMENT
        );
        return newScore;
      });

      // Place new food
      placeFood();
    } else {
      // Remove tail if no food was eaten
      snake.pop();
    }
    snakeRef.current = snake;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, highScore]);

  // Draw the game on canvas
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw background grid
    ctx.fillStyle = "#e0f2e9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw snake
    snakeRef.current.forEach((segment, index) => {
      // Head is darker green
      if (index === 0) {
        ctx.fillStyle = "#15803d"; // dark green fillStyle to fll colour of the shape
        ctx.strokeStyle = "#166534"; // strokeStyle to colour the borders
      } else {
        // Body alternates between two greens
        ctx.fillStyle = index % 2 === 0 ? "#22c55e" : "#16a34a"; // #22c55e - Dark cyan lime green  and #16a34a is Strong Cyan Lime Greem
        ctx.strokeStyle = "#166534";
      }
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
      ctx.strokeRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
      // Draw snake eyes on head
      if (index === 0) {
        ctx.fillStyle = "#000";
        // Position eyes based on direction
        let eyeX1, eyeY1, eyeX2, eyeY2;
        switch (directionRef.current) {
          case "UP":
            eyeX1 = segment.x * CELL_SIZE + 5;
            eyeY1 = segment.y * CELL_SIZE + 5;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE - 5;
            eyeY2 = segment.y * CELL_SIZE + 5;
            break;
          case "DOWN":
            eyeX1 = segment.x * CELL_SIZE + 5;
            eyeY1 = segment.y * CELL_SIZE + CELL_SIZE - 5;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE - 5;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE - 5;
            break;
          case "LEFT":
            eyeX1 = segment.x * CELL_SIZE + 5;
            eyeY1 = segment.y * CELL_SIZE + 5;
            eyeX2 = segment.x * CELL_SIZE + 5;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE - 5;
            break;
          case "RIGHT":
            eyeX1 = segment.x * CELL_SIZE + CELL_SIZE - 5;
            eyeY1 = segment.y * CELL_SIZE + 5;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE - 5;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE - 5;
            break;
        }

        ctx.beginPath(); // Begins a new path so you dont connect it to previous drawings.

        ctx.arc(eyeX1, eyeY1, 2, 0, Math.PI * 2); // Draws a circle at (eyeX1, eyeY1) with radius 2 and from angle 0 to 2π (i.e., full circle).

        ctx.fill(); // fill with colour #000

        ctx.beginPath(); // // Begins a new path so you don’t connect it to previous drawings.

        ctx.arc(eyeX2, eyeY2, 2, 0, Math.PI * 2); // Draws a circle at (eyeX2, eyeY2) with radius 2 and from angle 0 to 2π (i.e., full circle).

        ctx.fill(); // fill with colour #000
      }
    });

    // Draw food (apple)
    const food = foodRef.current;
    // Draw apple body
    ctx.fillStyle = "#ef4444"; // red
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 1,
      0,
      Math.PI * 2
    );
    ctx.fill();
    // Draw apple stem
    ctx.fillStyle = "#4b5563";
    // fillRect is a method used to draw and fill a rectangle on the canvas.
    ctx.fillRect(
      food.x * CELL_SIZE + CELL_SIZE / 2 - 1,
      food.y * CELL_SIZE + 2,
      2,
      4
    );
    // Draw apple leaf
    ctx.fillStyle = "#22c55e";
    ctx.beginPath(); // begins new path
    ctx.ellipse(
      food.x * CELL_SIZE + CELL_SIZE / 2 + 3,
      food.y * CELL_SIZE + 4,
      3,
      2,
      Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, []);
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted && !gameOver) {
        startGame();
        return;
      }
      if (gameOver) {
        return;
      }

      if (e.key === " " || e.code === "Space") {
        setIsPaused((prev) => !prev);
        return;
      }

      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          " ",
          "w",
          "W",
          "a",
          "A",
          "s",
          "S",
          "d",
          "D",
        ].includes(e.key)
      ) {
        e.preventDefault(); // Prevent scrolling
      }
      // Prevent opposite direction (can't go directly backwards)
      switch (e.key) {
        case "w":
        case "W":
        case "ArrowUp":
          if (directionRef.current !== "DOWN") {
            directionRef.current = "UP";
          }
          break;
        case "s":
        case "S":
        case "ArrowDown":
          if (directionRef.current !== "UP") {
            directionRef.current = "DOWN";
          }
          break;
        case "a":
        case "A":
        case "ArrowLeft":
          if (directionRef.current !== "RIGHT") {
            directionRef.current = "LEFT";
          }
          break;
        case "d":
        case "D":
        case "ArrowRight":
          if (directionRef.current !== "LEFT") {
            directionRef.current = "RIGHT";
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver, hasStarted, startGame]);

  // Start game loop
  useEffect(() => {
    if (!isPaused && hasStarted && !gameOver) {
      lastRenderTimeRef.current = performance.now();
      window.requestAnimationFrame(gameLoop);
    }
  }, [gameLoop, isPaused, hasStarted, gameOver]);

  // Handle touch controls for mobile
  const handleTouchControl = (direction: Direction) => {
    if (gameOver) return;
    if (!hasStarted) {
      startGame();
    }

    // Prevent opposite direction
    switch (direction) {
      case "UP":
        if (directionRef.current !== "DOWN") {
          directionRef.current = "UP";
        }
        break;
      case "DOWN":
        if (directionRef.current !== "UP") {
          directionRef.current = "DOWN";
        }
        break;
      case "LEFT":
        if (directionRef.current !== "RIGHT") {
          directionRef.current = "LEFT";
        }
        break;
      case "RIGHT":
        if (directionRef.current !== "LEFT") {
          directionRef.current = "RIGHT";
        }
        break;
    }
  };

  return (
    // md:max-w-full
    <div className="w-full max-w-md  mx-auto bg-white border-4 border-green-500 rounded-3xl shadow-2xl overflow-hidden">
      {/* Snake pattern top border */}
      <div className="h-6 bg-green-500 flex">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-6 bg-green-600 rounded-full mx-0.5"
          ></div>
        ))}
      </div>
      {/* Game header */}
      <div className="bg-green-400 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <TrophyIcon className="h-5 w-5 text-yellow-400" />
          <span className="font-bold text-green-800">
            High Score: {highScore}
          </span>
        </div>
        <div className="text-xl font-bold text-green-800">Snake Game</div>
        <div className="flex items-center space-x-2">
          <span className="font-bold text-green-800">Score: {score}</span>
        </div>
      </div>

      {/* Game canvas */}
      <div className="relative bg-green-50 p-4 flex justify-center">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="border-2 border-green-400 rounded-lg shadow-md"
        />
        {/* Game over overlay */}
        {gameOver && (
          // inset-0 is a shorthand utility that applies top, right, bottom, and left all set to 0.
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-lg">
            <div className="text-white text-3xl font-bold mb-4">Game Over!</div>
            <div className="text-white text-xl mb-6">Score: {score}</div>
            <button
              onClick={() => {
                initGame();
                startGame();
              }}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-bold text-lg transform hover:scale-105 transition-all duration-150 shadow-lg shadow-green-300/50 border-b-4 border-green-700"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Start game overlay */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-900 bg-opacity-80 rounded-lg">
            <div className="text-white text-3xl font-bold mb-4">Snake Game</div>
            <div className="text-white text-lg mb-6 text-center px-4">
              Use arrow keys or touch controls to move.
              <br />
              Collect apples to grow and score!
            </div>
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-xl font-bold text-xl transform hover:scale-105 transition-all duration-150 shadow-lg shadow-green-300/50 border-b-4 border-green-700 flex items-center"
            >
              <PlayIcon className="mr-2 h-5 w-5" /> Start Game
            </button>
          </div>
        )}
      </div>

      {/* Game controls */}
      <div className="bg-green-50 p-4">
        {/* Pause/Play and Restart buttons */}
        <div className="flex justify-center space-x-4 mb-4">
          {hasStarted && !gameOver && (
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-bold flex items-center"
            >
              {isPaused ? (
                <>
                  <PlayIcon className="mr-1 h-4 w-4" /> Resume
                </>
              ) : (
                <>
                  <PauseIcon className="mr-1 h-4 w-4" /> Pause
                </>
              )}
            </button>
          )}
          {hasStarted && (
            <button
              onClick={() => {
                initGame();
                startGame();
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-bold flex items-center"
            >
              <RotateCcwIcon className="mr-1 h-4 w-4" /> Restart
            </button>
          )}
        </div>
        
        {/* Touch controls for mobile */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          <div className="col-start-2">
            <button
              onClick={() => handleTouchControl("UP")}
              className="w-full h-12 bg-green-400 hover:bg-green-500 rounded-lg flex items-center justify-center text-white font-bold"
            >
              ↑
            </button>
          </div>
          <div className="col-start-1 col-end-4 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleTouchControl("LEFT")}
              className="w-full h-12 bg-green-400 hover:bg-green-500 rounded-lg flex items-center justify-center text-white font-bold"
            >
              ←
            </button>
            <button
              onClick={() => handleTouchControl("DOWN")}
              className="w-full h-12 bg-green-400 hover:bg-green-500 rounded-lg flex items-center justify-center text-white font-bold"
            >
              ↓
            </button>
            <button
              onClick={() => handleTouchControl("RIGHT")}
              className="w-full h-12 bg-green-400 hover:bg-green-500 rounded-lg flex items-center justify-center text-white font-bold"
            >
              →
            </button>
          </div>
        </div>
        {/* Game instructions */}
        <div className="mt-4 text-center text-green-700 text-sm">
          <p>Use arrow keys or touch controls to move.</p>
          <p>Press space to pause/resume.</p>
        </div>
      </div>
      {/* Snake pattern bottom border */}
      <div className="h-6 bg-green-500 flex">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-6 bg-green-600 rounded-full mx-0.5"
          ></div>
        ))}
      </div>
    </div>
  );
};
export default SnakeGame;
