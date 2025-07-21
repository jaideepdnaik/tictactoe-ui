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
    
    // Convert 2D to 1D
    const board1D = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        board1D.push(board2D[row] ? board2D[row][col] : null);
      }
    }
    return board1D;
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
    return {
      id: gameData.gameId || gameData.id,
      board: this.convertBoardTo1D(gameData.board),
      currentPlayer: gameData.currentPlayer || 'X',
      isGameOver: gameData.isGameOver || false,
      winner: gameData.winner || null,
      isDraw: gameData.isDraw || false,
      winningCells: gameData.winningCells || [],
      createdAt: gameData.createdAt,
      lastMoveAt: gameData.lastMoveAt
    };
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
      console.log('Game created successfully:', gameData);

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
        col: coordinates.col,
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
      return this.normalizeGameResponse(gameData);
    } catch (error) {
      console.error('Error making move:', error);
      throw error;
    }
  }
}

const gameService = new GameService();
export default gameService;
