const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class GameService {
  // Helper function to convert 2D board (3x3) to 1D board (9 elements)
  convertBoardTo1D(board2D) {    
    if (!board2D || !Array.isArray(board2D)) {
      return Array(9).fill(null);
    }
    
    // If it's already a 1D array, return as is
    if (board2D.length === 9 && !Array.isArray(board2D[0])) {
      return board2D;
    }
    
    // Check if it's a 2D array (string[][])
    if (board2D.length === 3 && Array.isArray(board2D[0])) {
      const board1D = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const cellValue = board2D[row] && board2D[row][col] !== undefined ? board2D[row][col] : null;
          // Convert empty strings to null
          const normalizedValue = cellValue === "" || cellValue === null || cellValue === undefined ? null : cellValue;
          board1D.push(normalizedValue);
        }
      }
      return board1D;
    }
    
    return Array(9).fill(null);
  }

  // Helper function to convert 1D board (9 elements) to 2D board (3x3)
  convertBoardTo2D(board1D) {
    if (!board1D || !Array.isArray(board1D) || board1D.length !== 9) {
      return [[null, null, null], [null, null, null], [null, null, null]];
    }
    
    const board2D = [];
    for (let row = 0; row < 3; row++) {
      board2D[row] = [];
      for (let col = 0; col < 3; col++) {
        board2D[row][col] = board1D[row * 3 + col];
      }
    }
    return board2D;
  }

  // Helper function to convert 1D index to 2D coordinates
  indexTo2D(index) {
    return {
      row: Math.floor(index / 3),
      col: index % 3
    };
  }

  // Helper function to normalize game response
  normalizeGameResponse(gameData) {

    // Handle nested game structure (when API returns { game: {...} })
    const game = gameData.game || gameData;
    
    const normalized = {
      id: game.gameId || game.id || gameData.gameId || gameData.id,
      board: this.convertBoardTo1D(game.board),
      currentPlayer: game.currentPlayer || 'X',
      isGameOver: game.isGameOver || false,
      winner: game.winner || null,
      isDraw: game.isDraw || false,
      winningCells: game.winningCells || [],
      createdAt: game.createdAt || gameData.createdAt,
      lastMoveAt: game.lastMoveAt || gameData.lastMoveAt
    };
    
    return normalized;
  }

  async createGame() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create game');
      }
      
      const gameData = await response.json();

      return this.normalizeGameResponse(gameData);
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  async getGames() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Games`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      
      const gamesData = await response.json();
      return gamesData.map(game => this.normalizeGameResponse(game));
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  async getGame(gameId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Games/${gameId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch game');
      }
      
      const gameData = await response.json();
      return this.normalizeGameResponse(gameData);
    } catch (error) {
      console.error('Error fetching game:', error);
      throw error;
    }
  }

  async deleteGame(gameId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Games/${gameId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete game');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }

  async makeMove(gameId, moveData) {
    try {
      // Convert 1D index to 2D coordinates for the API
      const coordinates = this.indexTo2D(moveData.position);
      
      const apiMoveData = {
        row: coordinates.row,
        column: coordinates.col,
        player: moveData.player
      };

      const response = await fetch(`${API_BASE_URL}/api/Games/${gameId}/moves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiMoveData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to make move');
      }
      
      const gameData = await response.json();

      console.log('Move made successfully:', gameData);
      console.log('Board after making the move : ', gameData.game.board);

      return this.normalizeGameResponse(gameData);
    } catch (error) {
      console.error('Error making move:', error);
      throw error;
    }
  }

  // Multiplayer game methods via REST API
  
  async getAvailableMultiplayerGames() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/multiplayer/available`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch available multiplayer games');
      }
      
      const gamesData = await response.json();
      return gamesData.map(game => this.normalizeGameResponse(game));
    } catch (error) {
      console.error('Error fetching available multiplayer games:', error);
      throw error;
    }
  }

  async createMultiplayerGame(playerName) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/multiplayer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create multiplayer game');
      }
      
      const gameData = await response.json();
      return this.normalizeGameResponse(gameData);
    } catch (error) {
      console.error('Error creating multiplayer game:', error);
      throw error;
    }
  }

  async joinMultiplayerGame(gameId, playerName) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to join multiplayer game');
      }
      
      const gameData = await response.json();
      return this.normalizeGameResponse(gameData);
    } catch (error) {
      console.error('Error joining multiplayer game:', error);
      throw error;
    }
  }
}

const gameService = new GameService();
export default gameService;
