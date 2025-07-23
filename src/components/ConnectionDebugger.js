import React, { useState, useEffect } from 'react';
import signalRService from '../services/signalRService';
import './ConnectionDebugger.css';

const ConnectionDebugger = ({ onClose }) => {
  const [debugInfo, setDebugInfo] = useState({
    backendUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    signalRUrl: '',
    restApiTest: null,
    signalRTest: null,
    currentState: 'Not tested'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      signalRUrl: `${prev.backendUrl}/gameHub`,
      currentState: signalRService.getConnectionState()
    }));
  }, []);

  const testRestAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${debugInfo.backendUrl}/api/Games`);
      const result = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        message: response.ok ? 'REST API is accessible' : `HTTP ${response.status}: ${response.statusText}`
      };
      setDebugInfo(prev => ({ ...prev, restApiTest: result }));
    } catch (error) {
      setDebugInfo(prev => ({
        ...prev,
        restApiTest: {
          success: false,
          message: `Connection failed: ${error.message}`,
          error: error.name
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testSignalR = async () => {
    setIsLoading(true);
    try {
      await signalRService.disconnect();
      await signalRService.connect();
      setDebugInfo(prev => ({
        ...prev,
        signalRTest: {
          success: true,
          message: 'SignalR connection successful',
          state: signalRService.getConnectionState()
        },
        currentState: signalRService.getConnectionState()
      }));
    } catch (error) {
      setDebugInfo(prev => ({
        ...prev,
        signalRTest: {
          success: false,
          message: error.message,
          error: error.name
        },
        currentState: signalRService.getConnectionState()
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testAll = async () => {
    await testRestAPI();
    await testSignalR();
  };

  return (
    <div className="connection-debugger-modal">
      <div className="debugger-content">
        <div className="debugger-header">
          <h3>🔧 Connection Debugger</h3>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        <div className="debug-info">
          <div className="info-section">
            <h4>Configuration</h4>
            <div className="info-item">
              <strong>Backend URL:</strong> 
              <code>{debugInfo.backendUrl}</code>
            </div>
            <div className="info-item">
              <strong>SignalR Hub URL:</strong> 
              <code>{debugInfo.signalRUrl}</code>
            </div>
            <div className="info-item">
              <strong>Current SignalR State:</strong> 
              <span className={`state ${debugInfo.currentState.toLowerCase()}`}>
                {debugInfo.currentState}
              </span>
            </div>
          </div>

          <div className="test-section">
            <h4>Connection Tests</h4>
            
            <div className="test-item">
              <div className="test-header">
                <span>REST API Test</span>
                <button onClick={testRestAPI} disabled={isLoading}>
                  {isLoading ? '⏳ Testing...' : '🔄 Test REST API'}
                </button>
              </div>
              {debugInfo.restApiTest && (
                <div className={`test-result ${debugInfo.restApiTest.success ? 'success' : 'error'}`}>
                  <strong>Result:</strong> {debugInfo.restApiTest.message}
                  {debugInfo.restApiTest.status && (
                    <div><strong>Status:</strong> {debugInfo.restApiTest.status}</div>
                  )}
                </div>
              )}
            </div>

            <div className="test-item">
              <div className="test-header">
                <span>SignalR Connection Test</span>
                <button onClick={testSignalR} disabled={isLoading}>
                  {isLoading ? '⏳ Testing...' : '🔄 Test SignalR'}
                </button>
              </div>
              {debugInfo.signalRTest && (
                <div className={`test-result ${debugInfo.signalRTest.success ? 'success' : 'error'}`}>
                  <strong>Result:</strong> {debugInfo.signalRTest.message}
                  {debugInfo.signalRTest.state && (
                    <div><strong>State:</strong> {debugInfo.signalRTest.state}</div>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={testAll} 
              disabled={isLoading}
              className="test-all-button"
            >
              {isLoading ? '⏳ Testing All...' : '🚀 Test All Connections'}
            </button>
          </div>

          <div className="troubleshooting-section">
            <h4>Troubleshooting Tips</h4>
            <ul>
              <li>Ensure your backend server is running on <code>{debugInfo.backendUrl}</code></li>
              <li>Check that the SignalR hub is properly configured at <code>/gameHub</code></li>
              <li>Verify CORS is configured to allow <code>http://localhost:3000</code></li>
              <li>Make sure CORS includes <code>.AllowCredentials()</code> for SignalR</li>
              <li>Check browser console for detailed error messages</li>
              <li>Try refreshing the page if connection fails</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDebugger;
