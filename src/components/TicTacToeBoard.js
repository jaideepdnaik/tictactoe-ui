import React from 'react';
import './TicTacToeBoard.css';

const TicTacToeBoard = ({ board, onCellClick, winner, disabled }) => {
  const renderCell = (index) => {
    const value = board[index];
    const isWinningCell = winner && winner.winningCells && winner.winningCells.includes(index);
    
    return (
      <button
        key={index}
        className={`cell ${value ? 'filled' : ''} ${isWinningCell ? 'winning' : ''}`}
        onClick={() => onCellClick(index)}
        disabled={disabled || value}
      >
        {value && (
          <span className={`symbol ${value.toLowerCase()}`}>
            {value}
          </span>
        )}
      </button>
    );
  };

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
