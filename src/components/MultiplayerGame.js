import React, { useState, useEffect, useCallback } from 'react';
import TicTacToeBoard from './TicTacToeBoard';
import MultiplayerGameList from './MultiplayerGameList';
import ConnectionDebugger from './ConnectionDebugger';
import signalRService from '../services/signalRService';
import gameService from '../services/gameService';
import './MultiplayerGame.css';

const MultiplayerGame = () => {
  const [gameState, setGameState] = useState({
    id: null,
    board: Array(9).fill(null),
    currentPlayer: 'X',
    isGameOver: false,
    winner: null,
    isDraw: false,
    winningCells: [],
    players: [],
    isMultiplayer: true
  });

  const [playerName, setPlayerName] = useState('');
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [connectionState, setConnectionState] = useState('Disconnected');
  const [availableGames, setAvailableGames] = useState([]);
  const [showAvailableGames, setShowAvailableGames] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameMessages, setGameMessages] = useState([]);

  // Helper function to add game messages
  const addGameMessage = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setGameMessages(prev => [...prev.slice(-4), { message, type, timestamp }]);
  }, []);

  // Helper function to convert board format
  const convertBoardTo1D = useCallback((board2D) => {
    if (!board2D || !Array.isArray(board2D)) {
      return Array(9).fill(null);
    }
    
    if (board2D.length === 9 && !Array.isArray(board2D[0])) {
      return board2D;
    }
    
    if (board2D.length === 3 && Array.isArray(board2D[0])) {
      const board1D = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const cellValue = board2D[row] && board2D[row][col] !== undefined ? board2D[row][col] : null;
          const normalizedValue = cellValue === "" || cellValue === null || cellValue === undefined ? null : cellValue;
          board1D.push(normalizedValue);
        }
      }
      return board1D;
    }
    
    return Array(9).fill(null);
  }, []);

  // SignalR event handlers
  const handleGameCreated = useCallback((data) => {
    console.log('Game created event:', data);
    addGameMessage(`Game created successfully! Game ID: ${data.gameId}`, 'success');
    
    setGameState(prev => ({
      ...prev,
      id: data.gameId,
      board: convertBoardTo1D(data.board),
      currentPlayer: data.currentPlayer || 'X',
      players: data.players || [],
      isGameOver: false,
      winner: null,
      isDraw: false
    }));
  }, [addGameMessage, convertBoardTo1D]);

  const handleGameJoined = useCallback((data) => {
    console.log('Game joined event:', data);
    addGameMessage(`Successfully joined game! Waiting for opponent...`, 'success');
    
    setGameState(prev => ({
      ...prev,
      id: data.gameId,
      board: convertBoardTo1D(data.board),
      currentPlayer: data.currentPlayer || 'X',
      players: data.players || [],
      isGameOver: false,
      winner: null,
      isDraw: false
    }));
  }, [addGameMessage, convertBoardTo1D]);

  const handlePlayerJoined = useCallback((data) => {
    console.log('Player joined event:', data);
    addGameMessage(`${data.playerName} joined the game!`, 'info');
    
    setGameState(prev => ({
      ...prev,
      players: data.players || prev.players
    }));
  }, [addGameMessage]);

  const handleMoveMade = useCallback((data) => {
    console.log('Move made event:', data);
    addGameMessage(`Move made by ${data.playerName}`, 'info');
    
    setGameState(prev => ({
      ...prev,
      board: convertBoardTo1D(data.board),
      currentPlayer: data.currentPlayer,
      isGameOver: data.isGameOver || false,
      winner: data.winner || null,
      isDraw: data.isDraw || false,
      winningCells: data.winningCells || []
    }));
  }, [addGameMessage, convertBoardTo1D]);

  const handleGameEnded = useCallback((data) => {
    console.log('Game ended event:', data);
    const endMessage = data.isDraw ? 
      "Game ended in a draw!" : 
      `Game over! ${data.winner} wins!`;
    addGameMessage(endMessage, 'success');
    
    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      winner: data.winner,
      isDraw: data.isDraw,
      winningCells: data.winningCells || []
    }));
  }, [addGameMessage]);

  const handleMoveRejected = useCallback((data) => {
    console.log('Move rejected event:', data);
    addGameMessage(`Move rejected: ${data.reason}`, 'error');
  }, [addGameMessage]);

  const handlePlayerLeft = useCallback((data) => {
    console.log('Player left event:', data);
    addGameMessage(`${data.playerName} left the game`, 'warning');
  }, [addGameMessage]);

  const handlePlayerDisconnected = useCallback((data) => {
    console.log('Player disconnected event:', data);
    addGameMessage(`${data.playerName} disconnected`, 'warning');
  }, [addGameMessage]);

  const handleSignalRError = useCallback((data) => {
    console.error('SignalR error event:', data);
    addGameMessage(`Error: ${data.message}`, 'error');
    setError(data.message);
  }, [addGameMessage]);

  const handleJoinGameFailed = useCallback((data) => {
    console.log('Join game failed event:', data);
    addGameMessage(`Failed to join game: ${data.reason}`, 'error');
    setError(data.reason);
  }, [addGameMessage]);

  // Initialize SignalR connection and event listeners
  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        setConnectionState('Connecting');
        addGameMessage('Testing backend connection...', 'info');
        
        // First test if backend is reachable
        const backendTest = await signalRService.testConnection();
        if (!backendTest.success) {
          throw new Error(backendTest.message);
        }
        
        addGameMessage('Backend is accessible, connecting to SignalR...', 'info');
        
        await signalRService.connect();
        setConnectionState('Connected');
        addGameMessage('Connected to multiplayer server', 'success');

        // Add event listeners
        signalRService.addEventListener('GameCreated', handleGameCreated);
        signalRService.addEventListener('GameJoined', handleGameJoined);
        signalRService.addEventListener('PlayerJoined', handlePlayerJoined);
        signalRService.addEventListener('MoveMade', handleMoveMade);
        signalRService.addEventListener('GameEnded', handleGameEnded);
        signalRService.addEventListener('MoveRejected', handleMoveRejected);
        signalRService.addEventListener('PlayerLeft', handlePlayerLeft);
        signalRService.addEventListener('PlayerDisconnected', handlePlayerDisconnected);
        signalRService.addEventListener('Error', handleSignalRError);
        signalRService.addEventListener('JoinGameFailed', handleJoinGameFailed);

        signalRService.addEventListener('ConnectionClosed', () => {
          setConnectionState('Disconnected');
          addGameMessage('Disconnected from server', 'error');
        });

        signalRService.addEventListener('Reconnecting', () => {
          setConnectionState('Reconnecting');
          addGameMessage('Reconnecting to server...', 'warning');
        });

        signalRService.addEventListener('Reconnected', () => {
          setConnectionState('Connected');
          addGameMessage('Reconnected to server', 'success');
        });

      } catch (error) {
        console.error('Failed to connect to SignalR:', error);
        setConnectionState('Disconnected');
        setError(`Connection failed: ${error.message}`);
        addGameMessage(`Failed to connect: ${error.message}`, 'error');
        
        // Add troubleshooting info
        addGameMessage('Troubleshooting: Check if backend server is running on http://localhost:5000', 'warning');
      }
    };

    initializeSignalR();

    // Update connection state periodically
    const connectionStateInterval = setInterval(() => {
      setConnectionState(signalRService.getConnectionState());
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(connectionStateInterval);
      signalRService.removeAllEventListeners();
      signalRService.disconnect();
    };
  }, [
    handleGameCreated, handleGameJoined, handlePlayerJoined, handleMoveMade,
    handleGameEnded, handleMoveRejected, handlePlayerLeft, handlePlayerDisconnected,
    handleSignalRError, handleJoinGameFailed, addGameMessage
  ]);

  // Game actions
  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setCurrentPlayerName(playerName.trim());
      await signalRService.createGame(playerName.trim());
      addGameMessage('Creating game...', 'info');
    } catch (error) {
      console.error('Error creating game:', error);
      setError('Failed to create game');
      addGameMessage('Failed to create game', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGame = async (gameId) => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setCurrentPlayerName(playerName.trim());
      await signalRService.joinGame(gameId, playerName.trim());
      addGameMessage(`Joining game ${gameId}...`, 'info');
      setShowAvailableGames(false);
    } catch (error) {
      console.error('Error joining game:', error);
      setError('Failed to join game');
      addGameMessage('Failed to join game', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadAvailableGames = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const games = await gameService.getAvailableMultiplayerGames();
      setAvailableGames(games);
      setShowAvailableGames(true);
      addGameMessage('Available games loaded', 'info');
    } catch (error) {
      console.error('Error loading available games:', error);
      setError('Failed to load available games');
      addGameMessage('Failed to load available games', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellClick = async (cellIndex) => {
    if (!gameState.id || gameState.board[cellIndex] || gameState.isGameOver || !signalRService.isConnectionActive()) {
      return;
    }

    // Check if it's the current player's turn
    const currentPlayerObj = gameState.players.find(p => p.name === currentPlayerName);
    if (!currentPlayerObj || currentPlayerObj.symbol !== gameState.currentPlayer) {
      addGameMessage("It's not your turn!", 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const coordinates = {
        row: Math.floor(cellIndex / 3),
        column: cellIndex % 3,
        player: gameState.currentPlayer
      };

      await signalRService.makeMove(gameState.id, coordinates);
    } catch (error) {
      console.error('Error making move:', error);
      addGameMessage('Failed to make move', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGame = async () => {
    if (!gameState.id) return;

    try {
      await signalRService.leaveGame(gameState.id);
      setGameState({
        id: null,
        board: Array(9).fill(null),
        currentPlayer: 'X',
        isGameOver: false,
        winner: null,
        isDraw: false,
        winningCells: [],
        players: [],
        isMultiplayer: true
      });
      addGameMessage('Left the game', 'info');
    } catch (error) {
      console.error('Error leaving game:', error);
      addGameMessage('Failed to leave game', 'error');
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

  const getGameStatus = () => {
    if (!gameState.id) return 'No active game';
    if (gameState.isGameOver) {
      return gameState.isDraw ? 'Game ended in a draw' : `Game over - ${gameState.winner} wins!`;
    }
    if (gameState.players.length < 2) return 'Waiting for opponent...';
    
    const currentPlayerObj = gameState.players.find(p => p.symbol === gameState.currentPlayer);
    const isMyTurn = currentPlayerObj && currentPlayerObj.name === currentPlayerName;
    
    return isMyTurn ? "Your turn!" : `${currentPlayerObj?.name || gameState.currentPlayer}'s turn`;
  };

  return (
    <div className="multiplayer-game">
      <div className="game-header">
        <h2>🎮 Multiplayer Tic Tac Toe</h2>
        <div className="header-controls">
          <div className="connection-status">
            <span className={`status-indicator ${connectionState.toLowerCase()}`}>
              ● {connectionState}
            </span>
          </div>
          <button 
            onClick={() => setShowDebugger(true)}
            className="debug-button"
            title="Connection Debugger"
          >
            🔧 Debug
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="player-setup">
        <div className="name-input">
          <label htmlFor="playerName">Your Name:</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            disabled={!!gameState.id}
            maxLength={20}
          />
        </div>

        <div className="game-controls">
          <button
            onClick={handleCreateGame}
            disabled={isLoading || !playerName.trim() || !!gameState.id || connectionState !== 'Connected'}
          >
            {isLoading ? '⏳ Creating...' : '🆕 Create Game'}
          </button>
          
          <button
            onClick={handleLoadAvailableGames}
            disabled={isLoading || !playerName.trim() || !!gameState.id || connectionState !== 'Connected'}
          >
            {isLoading ? '⏳ Loading...' : '🔍 Join Game'}
          </button>

          {gameState.id && (
            <button
              onClick={handleLeaveGame}
              disabled={isLoading}
              className="leave-button"
            >
              🚪 Leave Game
            </button>
          )}
        </div>
      </div>

      <div className="game-info">
        <div className="game-status">
          <strong>Status:</strong> {getGameStatus()}
        </div>
        
        {gameState.id && (
          <div className="game-details">
            <div><strong>Game ID:</strong> {gameState.id}</div>
            <div><strong>Players:</strong> {gameState.players.map(p => `${p.name} (${p.symbol})`).join(', ')}</div>
          </div>
        )}
      </div>

      {gameState.id && (
        <TicTacToeBoard
          board={gameState.board}
          onCellClick={handleCellClick}
          winner={getWinnerInfo()}
          disabled={isLoading || gameState.isGameOver || connectionState !== 'Connected'}
        />
      )}

      <div className="game-messages">
        <h4>Game Messages</h4>
        <div className="messages-list">
          {gameMessages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              <span className="timestamp">{msg.timestamp}</span>
              <span className="content">{msg.message}</span>
            </div>
          ))}
        </div>
      </div>

      {showAvailableGames && (
        <MultiplayerGameList
          games={availableGames}
          onSelectGame={handleJoinGame}
          onClose={() => setShowAvailableGames(false)}
          onDeleteGame={null} // Disable delete for multiplayer games
          isLoading={isLoading}
        />
      )}
      {showDebugger && (
        <ConnectionDebugger onClose={() => setShowDebugger(false)} />
      )}
    </div>
  );
};

export default MultiplayerGame;
