import React, { useState, useEffect } from 'react';
import TicTacToeBoard from './components/TicTacToeBoard';
import GameControls from './components/GameControls';
import GameList from './components/GameList';
import gameService from './services/gameService';
import './TicTacToe.css';

const TicTacToe = () => {
  const [gameState, setGameState] = useState({
    id: null,
    board: Array(9).fill(null),
    currentPlayer: 'X',
    isGameOver: false,
    winner: null,
    isDraw: false,
    winningCells: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showGameList, setShowGameList] = useState(false);
  const [availableGames, setAvailableGames] = useState([]);
  const [error, setError] = useState(null);

  const handleCreateNewGame = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newGame = await gameService.createGame();
      setGameState({
        id: newGame.id,
        board: newGame.board || Array(9).fill(null),
        currentPlayer: newGame.currentPlayer || 'X',
        isGameOver: newGame.isGameOver || false,
        winner: newGame.winner || null,
        isDraw: newGame.isDraw || false,
        winningCells: newGame.winningCells || []
      });
    } catch (error) {
      setError('Failed to create new game. Please try again.');
      console.error('Error creating game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadGames = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const games = await gameService.getGames();
      setAvailableGames(games);
      setShowGameList(true);
    } catch (error) {
      setError('Failed to load games. Please try again.');
      console.error('Error loading games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGame = async (gameId) => {
    try {
      const game = await gameService.getGame(gameId);
      setGameState({
        id: game.id,
        board: game.board || Array(9).fill(null),
        currentPlayer: game.currentPlayer || 'X',
        isGameOver: game.isGameOver || false,
        winner: game.winner || null,
        isDraw: game.isDraw || false,
        winningCells: game.winningCells || []
      });
    } catch (error) {
      setError('Failed to load game. Please try again.');
      console.error('Error loading game:', error);
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
      await gameService.deleteGame(gameId);
      
      // If the deleted game is the current game, reset the state
      if (gameState.id === gameId) {
        setGameState({
          id: null,
          board: Array(9).fill(null),
          currentPlayer: 'X',
          isGameOver: false,
          winner: null,
          isDraw: false,
          winningCells: []
        });
      }
      
      // Refresh the games list
      const games = await gameService.getGames();
      setAvailableGames(games);
    } catch (error) {
      setError('Failed to delete game. Please try again.');
      console.error('Error deleting game:', error);
    }
  };

  const handleCellClick = async (cellIndex) => {
    if (!gameState.id || gameState.board[cellIndex] || gameState.isGameOver) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const moveData = {
        position: cellIndex,
        player: gameState.currentPlayer
      };

      const updatedGame = await gameService.makeMove(gameState.id, moveData);
      
      setGameState({
        id: updatedGame.id,
        board: updatedGame.board,
        currentPlayer: updatedGame.currentPlayer,
        isGameOver: updatedGame.isGameOver,
        winner: updatedGame.winner,
        isDraw: updatedGame.isDraw,
        winningCells: updatedGame.winningCells || []
      });
    } catch (error) {
      setError('Failed to make move. Please try again.');
      console.error('Error making move:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWinnerInfo = () => {
    if (!gameState.isGameOver) return null;
    
    return {
      isDraw: gameState.isDraw,
      winner: gameState.winner,
      winningCells: gameState.winningCells
    };
  };

  // Auto-create first game on component mount
  useEffect(() => {
    if (!gameState.id) {
      handleCreateNewGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tic-tac-toe-app">
      <div className="app-header">
        <h1>🎮 Tic Tac Toe Deluxe</h1>
        <p>Challenge yourself in this classic strategy game!</p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="game-container">
        <GameControls
          onNewGame={handleCreateNewGame}
          onLoadGame={handleLoadGames}
          onDeleteGame={handleDeleteGame}
          currentPlayer={gameState.currentPlayer}
          gameStatus={{
            isGameOver: gameState.isGameOver
          }}
          gameId={gameState.id}
          isLoading={isLoading}
        />

        <TicTacToeBoard
          board={gameState.board}
          onCellClick={handleCellClick}
          winner={getWinnerInfo()}
          disabled={isLoading || gameState.isGameOver}
        />
      </div>

      {showGameList && (
        <GameList
          games={availableGames}
          onSelectGame={handleSelectGame}
          onClose={() => setShowGameList(false)}
          onDeleteGame={handleDeleteGame}
        />
      )}

      <div className="app-footer">
        <p>Built with ❤️ using React & modern web technologies</p>
      </div>
    </div>
  );
};

export default TicTacToe;
