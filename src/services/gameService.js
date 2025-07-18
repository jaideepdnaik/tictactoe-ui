const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class GameService {
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
      
      return await response.json();
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
      
      return await response.json();
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
      
      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/Games/${gameId}/moves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moveData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to make move');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error making move:', error);
      throw error;
    }
  }
}

const gameService = new GameService();
export default gameService;
