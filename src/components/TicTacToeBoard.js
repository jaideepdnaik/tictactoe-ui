import React from 'react';
import './TicTacToeBoard.css';

const TicTacToeBoard = ({ board, onCellClick, winner, disabled }) => {
  const renderCell = (index) => {
    const value = board[index];
    const isWinningCell = winner && winner.winningCells && winner.winningCells.includes(index);
    
    // Safety check: ensure value is a string or null
    const cellValue = (value && typeof value === 'string') ? value : null;
    
    return (
      <button
        key={index}
        className={`cell ${cellValue ? 'filled' : ''} ${isWinningCell ? 'winning' : ''}`}
        onClick={() => onCellClick(index)}
        disabled={disabled || cellValue}
      >
        {cellValue && (
          <span className={`symbol ${cellValue.toLowerCase()}`}>
            {cellValue}
          </span>
        )}
      </button>
    );
  };

  // Safety check: ensure board is an array with 9 elements
  const safeBoard = Array.isArray(board) && board.length === 9 ? board : Array(9).fill(null);

  return (
    <div className="board-container">
      <div className="board">
        {Array.from({ length: 9 }, (_, index) => renderCell(index))}
      </div>
      {winner && (
        <div className="game-result">
          {winner.isDraw ? (
            <h2 className="draw">It's a Draw! 🤝</h2>
          ) : (
            <h2 className="winner">
              Player {winner.winner} Wins! 🎉
            </h2>
          )}
        </div>
      )}
    </div>
  );
};

export default TicTacToeBoard;
