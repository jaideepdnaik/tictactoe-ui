import React, { useState } from 'react';
import TicTacToe from './TicTacToe';
import MultiplayerGame from './components/MultiplayerGame';
import UseStateExamples from './examples/UseStateExamples';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('singleplayer');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'singleplayer':
        return <TicTacToe />;
      case 'multiplayer':
        return <MultiplayerGame />;
      case 'examples':
        return <UseStateExamples />;
      default:
        return <TicTacToe />;
    }
  };

  return (
    <div className="App">
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setCurrentView('singleplayer')}
          style={{
            padding: '10px 15px',
            background: currentView === 'singleplayer' ? '#3498db' : '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🎮 Single Player
        </button>
        <button 
          onClick={() => setCurrentView('multiplayer')}
          style={{
            padding: '10px 15px',
            background: currentView === 'multiplayer' ? '#3498db' : '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          � Multiplayer
        </button>
        <button 
          onClick={() => setCurrentView('examples')}
          style={{
            padding: '10px 15px',
            background: currentView === 'examples' ? '#3498db' : '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📚 Examples
        </button>
      </div>
      
      {renderCurrentView()}
    </div>
  );
}

export default App;
