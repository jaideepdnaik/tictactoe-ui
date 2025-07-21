import React, { useState } from 'react';
import TicTacToe from './TicTacToe';
import UseStateExamples from './examples/UseStateExamples';
import './App.css';

function App() {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="App">
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => setShowExamples(false)}
          style={{
            padding: '10px 15px',
            background: showExamples ? '#95a5a6' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🎮 Tic Tac Toe
        </button>
        <button 
          onClick={() => setShowExamples(true)}
          style={{
            padding: '10px 15px',
            background: showExamples ? '#3498db' : '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📚 useState Examples
        </button>
      </div>
      
      {showExamples ? <UseStateExamples /> : <TicTacToe />}
    </div>
  );
}

export default App;
