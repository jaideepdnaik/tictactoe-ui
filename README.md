# 🎮 Tic Tac Toe Deluxe - React Frontend

A beautiful and modern Tic Tac Toe game built with React that connects to a backend API for persistent game storage and real-time multiplayer functionality using SignalR.

## ✨ Features

- **🎨 Modern UI/UX**: Beautiful gradient backgrounds, smooth animations, and responsive design
- **� Real-time Multiplayer**: Play with friends using SignalR for instant updates
- **�🔄 Persistent Games**: Save and load games using backend API integration
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🎯 Game Management**: Create, load, and delete games with ease
- **🏆 Win Detection**: Automatic win detection with winning cell highlighting
- **⚡ Real-time Updates**: Smooth animations and immediate feedback
- **� Connection Status**: Live connection monitoring with reconnection support
- **💬 Game Messages**: Real-time game events and notifications
- **�🌙 Dark Mode Ready**: Supports system dark mode preferences

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server with SignalR hub running (see API Configuration below)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd /path/to/tictactoe-ui
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint**:
   Copy the example environment file and update it:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` to point to your backend API:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 🎯 How to Play

### Single Player Mode
1. **Start a New Game**: Click the "🎮 New Game" button to create a fresh game
2. **Make Moves**: Click on any empty cell to make your move
3. **Switch Players**: The game automatically alternates between X and O players
4. **Win the Game**: Get three of your symbols in a row (horizontal, vertical, or diagonal)
5. **Load Previous Games**: Click "📁 Load Game" to see and resume saved games
6. **Delete Games**: Remove unwanted games using the delete button

### Multiplayer Mode
1. **Enter Your Name**: Type your name in the player name field
2. **Create or Join**: 
   - Click "🆕 Create Game" to start a new multiplayer game
   - Click "� Join Game" to see available games and join one
3. **Wait for Opponent**: Once in a game, wait for another player to join
4. **Play Together**: Take turns making moves in real-time
5. **Real-time Updates**: See opponent moves instantly via SignalR connection

## �🔧 API Integration

The frontend integrates with the following backend endpoints:

### REST API Endpoints
- **POST** `/api/Games` - Create a new single-player game
- **GET** `/api/Games` - Get all games
- **GET** `/api/Games/{gameId}` - Get a specific game
- **DELETE** `/api/Games/{gameId}` - Delete a game
- **POST** `/api/Games/{gameId}/moves` - Make a move in a single-player game

### Multiplayer API Endpoints
- **GET** `/api/games/multiplayer/available` - Get available multiplayer games
- **POST** `/api/games/multiplayer` - Create multiplayer game via REST
- **POST** `/api/games/{gameId}/join` - Join game via REST

### SignalR Hub (`/gameHub`)
The application uses SignalR for real-time multiplayer communication:

#### Client to Server Methods:
- `JoinGame(gameId, playerName)` - Join an existing game
- `CreateGame(playerName)` - Create a new multiplayer game
- `MakeMove(gameId, move)` - Make a move in real-time
- `LeaveGame(gameId)` - Leave a multiplayer game

#### Server to Client Events:
- `PlayerJoined` - Another player joined the game
- `GameJoined` - Successfully joined a game
- `GameCreated` - Game created successfully
- `MoveMade` - A move was made by any player
- `GameEnded` - Game finished (win/draw)
- `MoveRejected` - Move was invalid
- `PlayerLeft` - Player left the game
- `PlayerDisconnected` - Player disconnected
- `Error` - General error message

### Expected API Response Format

```javascript
// Game Object
{
  id: "string",
  board: ["X", null, "O", null, "X", null, "O", null, "X"], // 9-element array
  currentPlayer: "X" | "O",
  isGameOver: boolean,
  winner: "X" | "O" | null,
  isDraw: boolean,
  winningCells: [0, 4, 8], // array of winning cell indices
  players: [
    { name: "Player1", symbol: "X" },
    { name: "Player2", symbol: "O" }
  ],
  createdAt: "2023-12-18T10:30:00Z",
  lastMoveAt: "2023-12-18T10:35:00Z"
}

// Move Request (Single Player)
{
  position: 0-8, // cell index
  player: "X" | "O"
}

// Move Request (Multiplayer via SignalR)
{
  row: 0-2,
  column: 0-2,
  player: "X" | "O"
}
```

## 🎨 Design Features

### Visual Elements
- **Gradient Backgrounds**: Beautiful color gradients throughout the interface
- **Neumorphism Effects**: Modern soft UI design with depth and shadows
- **Smooth Animations**: CSS transitions and keyframe animations for enhanced UX
- **Responsive Grid**: CSS Grid for perfect board layout on all screen sizes

### Interactive Elements
- **Hover Effects**: Cells lift and glow on hover
- **Click Feedback**: Visual and tactile feedback for all interactions
- **Loading States**: Clear loading indicators during API calls
- **Error Handling**: User-friendly error messages with retry options

### Color Scheme
- **Primary**: Blue gradients (#3498db to #2980b9)
- **Success**: Green gradients (#27ae60 to #2ecc71)
- **Warning**: Orange gradients (#f39c12 to #e67e22)
- **Danger**: Red gradients (#e74c3c to #c0392b)
- **Background**: Purple gradients (#667eea to #764ba2)

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: 480px to 767px
- **Small Mobile**: Below 480px

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

### Project Structure

```
src/
├── components/           # React components
│   ├── TicTacToeBoard.js    # Game board component
│   ├── TicTacToeBoard.css   # Board styling
│   ├── GameControls.js      # Control buttons component
│   ├── GameControls.css     # Controls styling
│   ├── GameList.js          # Saved games modal
│   └── GameList.css         # Game list styling
├── services/            # API services
│   └── gameService.js      # Game API client
├── TicTacToe.js        # Main game component
├── TicTacToe.css       # Main game styling
├── App.js              # App entry point
├── App.css             # Global styles
└── index.js            # React DOM render
```

### Customization

You can easily customize the appearance by modifying the CSS variables and gradient definitions in the respective CSS files.

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Failed**:
   - Ensure your backend server is running
   - Check the API URL in `.env` file
   - Verify CORS is properly configured on your backend

2. **Game Not Loading**:
   - Check browser console for errors
   - Verify backend API responses match expected format

3. **Styling Issues**:
   - Clear browser cache
   - Check for CSS conflicts
   - Ensure all CSS files are properly imported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Icons and emojis for enhanced visual appeal
- Modern CSS techniques for beautiful animations
- Responsive design principles for multi-device support

---

**Enjoy playing Tic Tac Toe Deluxe! 🎉**

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# tictactoe-ui
