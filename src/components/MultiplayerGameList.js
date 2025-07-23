import React from 'react';
import './MultiplayerGameList.css';

const MultiplayerGameList = ({ games, onSelectGame, onClose, onDeleteGame, isLoading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getGameStatus = (game) => {
    if (game.isGameOver) {
      return game.isDraw ? 'Draw' : `${game.winner} Won`;
    }
    
    const playerCount = game.players?.length || 0;
    if (playerCount === 0) return 'No players';
    if (playerCount === 1) return 'Waiting for opponent';
    return 'In progress';
  };

  const getGameStatusClass = (game) => {
    if (game.isGameOver) return 'finished';
    
    const playerCount = game.players?.length || 0;
    if (playerCount < 2) return 'waiting';
    return 'active';
  };

  return (
    <div className="multiplayer-game-list-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>🎮 Available Multiplayer Games</h3>
          <button onClick={onClose} className="close-button">✕</button>
        </div>
        
        <div className="games-container">
          {isLoading ? (
            <div className="loading-message">
              <div className="spinner"></div>
              <p>Loading available games...</p>
            </div>
          ) : games.length === 0 ? (
            <div className="empty-message">
              <div className="empty-icon">🎯</div>
              <h4>No available games found</h4>
              <p>Create a new game to start playing with others!</p>
            </div>
          ) : (
            <div className="games-list">
              {games.map(game => (
                <div key={game.id} className={`game-card ${getGameStatusClass(game)}`}>
                  <div className="game-header">
                    <div className="game-id">
                      <strong>Game {game.id.substring(0, 8)}...</strong>
                    </div>
                    <div className={`game-status ${getGameStatusClass(game)}`}>
                      {getGameStatus(game)}
                    </div>
                  </div>
                  
                  <div className="game-details">
                    <div className="detail-row">
                      <span className="label">Players:</span>
                      <span className="value">
                        {game.players?.length || 0}/2
                        {game.players?.length > 0 && (
                          <span className="player-names">
                            ({game.players.map(p => p.name).join(', ')})
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Current Turn:</span>
                      <span className="value player-turn">
                        {game.currentPlayer} 
                        {game.players?.find(p => p.symbol === game.currentPlayer)?.name && 
                          ` (${game.players.find(p => p.symbol === game.currentPlayer).name})`
                        }
                      </span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Created:</span>
                      <span className="value">{formatDate(game.createdAt)}</span>
                    </div>
                    
                    {game.lastMoveAt && (
                      <div className="detail-row">
                        <span className="label">Last Move:</span>
                        <span className="value">{formatDate(game.lastMoveAt)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="game-actions">
                    <button
                      onClick={() => onSelectGame(game.id)}
                      disabled={isLoading || game.isGameOver || (game.players?.length >= 2)}
                      className="join-button"
                    >
                      {game.isGameOver ? '🏁 Finished' : 
                       game.players?.length >= 2 ? '👥 Full' : 
                       '🚀 Join Game'}
                    </button>
                    
                    {onDeleteGame && (
                      <button
                        onClick={() => onDeleteGame(game.id)}
                        disabled={isLoading}
                        className="delete-button"
                        title="Delete Game"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="footer-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerGameList;
