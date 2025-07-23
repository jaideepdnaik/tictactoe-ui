import * as signalR from '@microsoft/signalr';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.eventHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // Initialize connection
  async connect() {
    if (this.connection && this.isConnected) {
      return this.connection;
    }

    try {
      console.log('Attempting to connect to SignalR hub at:', `${API_BASE_URL}/gameHub`);
      
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}/gameHub`, {
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Set up connection event handlers
      this.connection.onclose(() => {
        this.isConnected = false;
        console.log('SignalR connection closed');
        this.notifyHandlers('ConnectionClosed');
      });

      this.connection.onreconnecting(() => {
        console.log('SignalR reconnecting...');
        this.notifyHandlers('Reconnecting');
      });

      this.connection.onreconnected(() => {
        this.isConnected = true;
        console.log('SignalR reconnected');
        this.notifyHandlers('Reconnected');
      });

      // Set up game event listeners
      this.setupGameEventListeners();

      // Start the connection
      console.log('Starting SignalR connection...');
      await this.connection.start();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('SignalR connection established successfully');
      
      return this.connection;
    } catch (error) {
      console.error('Error connecting to SignalR hub:', error);
      console.error('Connection URL:', `${API_BASE_URL}/gameHub`);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      this.isConnected = false;
      
      // Don't retry automatically on initial connection failure
      // Let the user handle it manually
      throw new Error(`Failed to connect to multiplayer server: ${error.message}`);
    }
  }

  // Disconnect from hub
  async disconnect() {
    if (this.connection) {
      try {
        await this.connection.stop();
        this.isConnected = false;
        console.log('SignalR connection stopped');
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      }
    }
  }

  // Set up event listeners for game events
  setupGameEventListeners() {
    if (!this.connection) return;

    // Player events
    this.connection.on('PlayerJoined', (data) => {
      console.log('Player joined:', data);
      this.notifyHandlers('PlayerJoined', data);
    });

    this.connection.on('GameJoined', (data) => {
      console.log('Game joined successfully:', data);
      this.notifyHandlers('GameJoined', data);
    });

    this.connection.on('JoinGameFailed', (data) => {
      console.log('Failed to join game:', data);
      this.notifyHandlers('JoinGameFailed', data);
    });

    this.connection.on('GameCreated', (data) => {
      console.log('Game created:', data);
      this.notifyHandlers('GameCreated', data);
    });

    // Game state events
    this.connection.on('MoveMade', (data) => {
      console.log('Move made:', data);
      this.notifyHandlers('MoveMade', data);
    });

    this.connection.on('GameEnded', (data) => {
      console.log('Game ended:', data);
      this.notifyHandlers('GameEnded', data);
    });

    this.connection.on('MoveRejected', (data) => {
      console.log('Move rejected:', data);
      this.notifyHandlers('MoveRejected', data);
    });

    // Player disconnect events
    this.connection.on('PlayerLeft', (data) => {
      console.log('Player left:', data);
      this.notifyHandlers('PlayerLeft', data);
    });

    this.connection.on('PlayerDisconnected', (data) => {
      console.log('Player disconnected:', data);
      this.notifyHandlers('PlayerDisconnected', data);
    });

    // Error events
    this.connection.on('Error', (data) => {
      console.error('SignalR error:', data);
      this.notifyHandlers('Error', data);
    });
  }

  // Hub method calls (Client to Server)
  
  // Join an existing multiplayer game
  async joinGame(gameId, playerName) {
    if (!this.isConnected || !this.connection) {
      throw new Error('Not connected to SignalR hub');
    }

    try {
      await this.connection.invoke('JoinGame', gameId, playerName);
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  }

  // Create a new multiplayer game
  async createGame(playerName) {
    if (!this.isConnected || !this.connection) {
      throw new Error('Not connected to SignalR hub');
    }

    try {
      await this.connection.invoke('CreateGame', playerName);
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  // Make a move in the game
  async makeMove(gameId, move) {
    if (!this.isConnected || !this.connection) {
      throw new Error('Not connected to SignalR hub');
    }

    try {
      await this.connection.invoke('MakeMove', gameId, move);
    } catch (error) {
      console.error('Error making move:', error);
      throw error;
    }
  }

  // Leave a multiplayer game
  async leaveGame(gameId) {
    if (!this.isConnected || !this.connection) {
      throw new Error('Not connected to SignalR hub');
    }

    try {
      await this.connection.invoke('LeaveGame', gameId);
    } catch (error) {
      console.error('Error leaving game:', error);
      throw error;
    }
  }

  // Event handler management
  addEventListener(eventName, handler) {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName).push(handler);
  }

  removeEventListener(eventName, handler) {
    if (this.eventHandlers.has(eventName)) {
      const handlers = this.eventHandlers.get(eventName);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  removeAllEventListeners(eventName) {
    if (eventName) {
      this.eventHandlers.delete(eventName);
    } else {
      this.eventHandlers.clear();
    }
  }

  notifyHandlers(eventName, data) {
    if (this.eventHandlers.has(eventName)) {
      const handlers = this.eventHandlers.get(eventName);
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error);
        }
      });
    }
  }

  // Utility methods
  getConnectionState() {
    if (!this.connection) return 'Disconnected';
    
    switch (this.connection.state) {
      case signalR.HubConnectionState.Disconnected:
        return 'Disconnected';
      case signalR.HubConnectionState.Connecting:
        return 'Connecting';
      case signalR.HubConnectionState.Connected:
        return 'Connected';
      case signalR.HubConnectionState.Disconnecting:
        return 'Disconnecting';
      case signalR.HubConnectionState.Reconnecting:
        return 'Reconnecting';
      default:
        return 'Unknown';
    }
  }

  isConnectionActive() {
    return this.isConnected && this.connection && this.connection.state === signalR.HubConnectionState.Connected;
  }

  // Test connection to the backend
  async testConnection() {
    try {
      console.log('Testing backend connection...');
      const response = await fetch(`${API_BASE_URL}/api/Games`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('Backend REST API is accessible');
        return { success: true, message: 'Backend is accessible' };
      } else {
        console.error('Backend responded with error:', response.status, response.statusText);
        return { success: false, message: `Backend error: ${response.status} ${response.statusText}` };
      }
    } catch (error) {
      console.error('Failed to reach backend:', error);
      return { success: false, message: `Cannot reach backend: ${error.message}` };
    }
  }
}

// Create a singleton instance
const signalRService = new SignalRService();
export default signalRService;
