import React, { useState, useEffect, useCallback } from 'react';

const BattleshipDemo = () => {
  const GRID_SIZE = 5;
  const SHIP_SIZES = [3, 2, 2]; // Smaller ships for 5x5 grid
  
  const [playerBoard, setPlayerBoard] = useState([]);
  const [computerBoard, setComputerBoard] = useState([]);
  const [playerShips, setPlayerShips] = useState([]);
  const [computerShips, setComputerShips] = useState([]);
  const [playerHits, setPlayerHits] = useState(new Set());
  const [computerHits, setComputerHits] = useState(new Set());
  const [gameStatus, setGameStatus] = useState('setup'); // setup, playing, gameOver
  const [currentPlayer, setCurrentPlayer] = useState('player');
  const [winner, setWinner] = useState(null);
  const [placingShipIndex, setPlacingShipIndex] = useState(0);
  const [isHorizontal, setIsHorizontal] = useState(true);

  // Initialize empty boards
  useEffect(() => {
    const emptyBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    setPlayerBoard([...emptyBoard]);
    setComputerBoard([...emptyBoard]);
  }, []);

  // Generate random ship placement for computer
  const generateRandomShips = useCallback(() => {
    const ships = [];
    const board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    
    for (let shipSize of SHIP_SIZES) {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const horizontal = Math.random() > 0.5;
        const startRow = Math.floor(Math.random() * GRID_SIZE);
        const startCol = Math.floor(Math.random() * GRID_SIZE);
        
        if (canPlaceShip(board, startRow, startCol, shipSize, horizontal)) {
          const shipCells = [];
          for (let i = 0; i < shipSize; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;
            board[row][col] = 1;
            shipCells.push(`${row}-${col}`);
          }
          ships.push(shipCells);
          placed = true;
        }
        attempts++;
      }
    }
    
    return { ships, board };
  }, []);

  const canPlaceShip = (board, startRow, startCol, size, horizontal) => {
    if (horizontal) {
      if (startCol + size > GRID_SIZE) return false;
      for (let i = 0; i < size; i++) {
        if (board[startRow][startCol + i] !== 0) return false;
      }
    } else {
      if (startRow + size > GRID_SIZE) return false;
      for (let i = 0; i < size; i++) {
        if (board[startRow + i][startCol] !== 0) return false;
      }
    }
    return true;
  };

  const handlePlayerCellClick = (row, col) => {
    if (gameStatus !== 'setup' || placingShipIndex >= SHIP_SIZES.length) return;
    
    const shipSize = SHIP_SIZES[placingShipIndex];
    if (!canPlaceShip(playerBoard, row, col, shipSize, isHorizontal)) return;
    
    const newBoard = [...playerBoard];
    const newShips = [...playerShips];
    const shipCells = [];
    
    for (let i = 0; i < shipSize; i++) {
      const shipRow = isHorizontal ? row : row + i;
      const shipCol = isHorizontal ? col + i : col;
      newBoard[shipRow][shipCol] = 1;
      shipCells.push(`${shipRow}-${shipCol}`);
    }
    
    newShips.push(shipCells);
    setPlayerBoard(newBoard);
    setPlayerShips(newShips);
    setPlacingShipIndex(placingShipIndex + 1);
    
    if (placingShipIndex + 1 >= SHIP_SIZES.length) {
      // Start game
      const computerData = generateRandomShips();
      setComputerBoard(computerData.board);
      setComputerShips(computerData.ships);
      setGameStatus('playing');
    }
  };

  const handleComputerCellClick = (row, col) => {
    if (gameStatus !== 'playing' || currentPlayer !== 'player') return;
    
    const cellKey = `${row}-${col}`;
    if (playerHits.has(cellKey)) return; // Already hit
    
    const newHits = new Set(playerHits);
    newHits.add(cellKey);
    setPlayerHits(newHits);
    
    // Check if all computer ships are sunk
    const allComputerCells = computerShips.flat();
    const computerHitCells = Array.from(newHits).filter(cell => 
      computerBoard[parseInt(cell.split('-')[0])][parseInt(cell.split('-')[1])] === 1
    );
    
    if (computerHitCells.length === allComputerCells.length && allComputerCells.length > 0) {
      setWinner('player');
      setGameStatus('gameOver');
      return;
    }
    
    setCurrentPlayer('computer');
    
    // Computer turn (simple random AI)
    setTimeout(() => {
      let computerRow, computerCol, cellKey;
      do {
        computerRow = Math.floor(Math.random() * GRID_SIZE);
        computerCol = Math.floor(Math.random() * GRID_SIZE);
        cellKey = `${computerRow}-${computerCol}`;
      } while (computerHits.has(cellKey));
      
      const newComputerHits = new Set(computerHits);
      newComputerHits.add(cellKey);
      setComputerHits(newComputerHits);
      
      // Check if all player ships are sunk
      const allPlayerCells = playerShips.flat();
      const playerHitCells = Array.from(newComputerHits).filter(cell => 
        playerBoard[parseInt(cell.split('-')[0])][parseInt(cell.split('-')[1])] === 1
      );
      
      if (playerHitCells.length === allPlayerCells.length && allPlayerCells.length > 0) {
        setWinner('computer');
        setGameStatus('gameOver');
        return;
      }
      
      setCurrentPlayer('player');
    }, 1000);
  };

  const resetGame = () => {
    const emptyBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    setPlayerBoard([...emptyBoard]);
    setComputerBoard([...emptyBoard]);
    setPlayerShips([]);
    setComputerShips([]);
    setPlayerHits(new Set());
    setComputerHits(new Set());
    setGameStatus('setup');
    setCurrentPlayer('player');
    setWinner(null);
    setPlacingShipIndex(0);
  };

  const getCellClass = (board, row, col, hits, isPlayerBoard = false) => {
    const cellKey = `${row}-${col}`;
    const isHit = hits.has(cellKey);
    const hasShip = board[row][col] === 1;
    
    let baseClass = 'w-8 h-8 border border-gray-400 cursor-pointer transition-colors ';
    
    if (isHit) {
      if (hasShip) {
        baseClass += 'bg-red-500 '; // Hit
      } else {
        baseClass += 'bg-blue-200 '; // Miss
      }
    } else {
      if (isPlayerBoard && hasShip) {
        baseClass += 'bg-gray-600 '; // Player's ships visible
      } else {
        baseClass += 'bg-gray-100 hover:bg-gray-200 ';
      }
    }
    
    return baseClass;
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 max-w-md mx-auto">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Mini Battleship</h3>
        
        {gameStatus === 'setup' && (
          <div className="text-cyan-400">
            <p>Place ship {placingShipIndex + 1} of {SHIP_SIZES.length}</p>
            <p>Size: {SHIP_SIZES[placingShipIndex]} cells</p>
            <button
              onClick={() => setIsHorizontal(!isHorizontal)}
              className="mt-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm"
            >
              {isHorizontal ? 'Horizontal' : 'Vertical'}
            </button>
          </div>
        )}
        
        {gameStatus === 'playing' && (
          <div className="text-cyan-400">
            <p>{currentPlayer === 'player' ? 'Your turn' : 'Computer thinking...'}</p>
          </div>
        )}
        
        {gameStatus === 'gameOver' && (
          <div className="text-center">
            <p className={`text-lg font-bold ${winner === 'player' ? 'text-green-400' : 'text-red-400'}`}>
              {winner === 'player' ? 'You Win!' : 'Computer Wins!'}
            </p>
            <button
              onClick={resetGame}
              className="mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded"
            >
              New Game
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-8">
        {/* Player Board */}
        <div className="text-center">
          <p className="text-white text-sm mb-2">Your Fleet</p>
          <div className="grid grid-cols-5 gap-1">
            {playerBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`player-${rowIndex}-${colIndex}`}
                  className={getCellClass(playerBoard, rowIndex, colIndex, computerHits, true)}
                  onClick={() => gameStatus === 'setup' && handlePlayerCellClick(rowIndex, colIndex)}
                />
              ))
            )}
          </div>
        </div>

        {/* Computer Board */}
        {gameStatus !== 'setup' && (
          <div className="text-center">
            <p className="text-white text-sm mb-2">Enemy Waters</p>
            <div className="grid grid-cols-5 gap-1">
              {computerBoard.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`computer-${rowIndex}-${colIndex}`}
                    className={getCellClass(computerBoard, rowIndex, colIndex, playerHits)}
                    onClick={() => handleComputerCellClick(rowIndex, colIndex)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-600"></div>
            <span>Ship</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500"></div>
            <span>Hit</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-200"></div>
            <span>Miss</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleshipDemo;