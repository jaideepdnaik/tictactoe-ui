import React from 'react';
import './GameControls.css';

const GameControls = ({ 
  onNewGame, 
  onLoadGame, 
  onDeleteGame, 
  currentPlayer, 
  gameStatus, 
  gameId,
  isLoading 
}) => {
  return (
    <div className="game-controls">
      <div className="game-info">
        {gameId && (
          <div className="game-id">
            <span className="label">Game ID:</span>
            <span className="value">{gameId}</span>
          </div>
        )}
        {currentPlayer && !gameStatus?.isGameOver && (
          <div className="current-player">
            <span className="label">Current Player:</span>
            <span className={`player-indicator ${currentPlayer.toLowerCase()}`}>
              {currentPlayer}
            </span>
          </div>
        )}
        {gameStatus?.isGameOver && (
          <div className="game-over">
            Game Over
          </div>
        )}
      </div>
      
      <div className="control-buttons">
        <button 
          className="btn btn-primary"
          onClick={onNewGame}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : '🎮 New Game'}
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={onLoadGame}
          disabled={isLoading}
        >
          📁 Load Game
        </button>
        
        {gameId && (
          <button 
            className="btn btn-danger"
            onClick={() => onDeleteGame(gameId)}
            disabled={isLoading}
          >
            🗑️ Delete Game
          </button>
        )}
      </div>
    </div>
  );
};

export default GameControls;
