import React, { useState } from 'react';
import './GameList.css';

const GameList = ({ games, onSelectGame, onClose, onDeleteGame }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectGame = async (gameId) => {
    setIsLoading(true);
    try {
      await onSelectGame(gameId);
      onClose();
    } catch (error) {
      console.error('Error selecting game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGame = async (gameId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await onDeleteGame(gameId);
      } catch (error) {
        console.error('Error deleting game:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getGameStatus = (game) => {
    if (game.isGameOver) {
      if (game.isDraw) return { text: 'Draw', class: 'draw' };
      return { text: `${game.winner} Won`, class: 'won' };
    }
    return { text: 'In Progress', class: 'progress' };
  };

  return (
    <div className="game-list-overlay">
      <div className="game-list-modal">
        <div className="modal-header">
          <h2>📋 Saved Games</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="game-list-content">
          {games.length === 0 ? (
            <div className="no-games">
              <p>🎮 No saved games found</p>
              <p>Start a new game to begin playing!</p>
            </div>
          ) : (
            <div className="games-grid">
              {games.map((game) => {
                const status = getGameStatus(game);
                return (
                  <div
                    key={game.id}
                    className={`game-card ${isLoading ? 'disabled' : ''}`}
                    onClick={() => !isLoading && handleSelectGame(game.id)}
                  >
                    <div className="game-card-header">
                      <span className="game-id">#{game.id.slice(0, 8)}</span>
                      <button
                        className="delete-btn"
                        onClick={(e) => handleDeleteGame(game.id, e)}
                        disabled={isLoading}
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="game-info">
                      <div className={`status ${status.class}`}>
                        {status.text}
                      </div>
                      
                      <div className="current-player">
                        {!game.isGameOver && (
                          <span>Turn: {game.currentPlayer}</span>
                        )}
                      </div>
                      
                      <div className="game-date">
                        {game.createdAt && formatDate(game.createdAt)}
                      </div>
                    </div>
                    
                    <div className="mini-board">
                      {game.board && game.board.map((cell, index) => (
                        <div key={index} className={`mini-cell ${cell ? cell.toLowerCase() : ''}`}>
                          {cell}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameList;
