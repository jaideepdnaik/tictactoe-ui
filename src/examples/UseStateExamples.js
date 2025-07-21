import React, { useState } from 'react';
import './UseStateExamples.css';

// Example 1: Simple Counter
const CounterExample = () => {
  // useState returns an array with 2 elements:
  // [currentValue, functionToUpdateValue]
  const [count, setCount] = useState(0); // Initial value is 0

  const increment = () => {
    setCount(count + 1); // Update count by adding 1
  };

  const decrement = () => {
    setCount(count - 1); // Update count by subtracting 1
  };

  const reset = () => {
    setCount(0); // Reset count to 0
  };

  return (
    <div className="example-box">
      <h3>📊 Counter Example</h3>
      <p className="count-display">Count: {count}</p>
      <div className="button-group">
        <button onClick={increment}>➕ Increment</button>
        <button onClick={decrement}>➖ Decrement</button>
        <button onClick={reset}>🔄 Reset</button>
      </div>
      <div className="explanation">
        <p><strong>How it works:</strong></p>
        <ul>
          <li><code>count</code> stores the current number</li>
          <li><code>setCount</code> updates the number</li>
          <li>When <code>setCount</code> is called, React re-renders the component</li>
        </ul>
      </div>
    </div>
  );
};

// Example 2: Text Input
const TextInputExample = () => {
  const [text, setText] = useState(''); // Initial value is empty string

  const handleInputChange = (event) => {
    setText(event.target.value); // Update text with input value
  };

  const clearText = () => {
    setText(''); // Clear the text
  };

  return (
    <div className="example-box">
      <h3>✏️ Text Input Example</h3>
      <input 
        type="text" 
        value={text} 
        onChange={handleInputChange}
        placeholder="Type something..."
        className="text-input"
      />
      <p className="text-display">You typed: "{text}"</p>
      <p className="text-length">Length: {text.length} characters</p>
      <button onClick={clearText}>🗑️ Clear</button>
      <div className="explanation">
        <p><strong>How it works:</strong></p>
        <ul>
          <li><code>text</code> stores what user types</li>
          <li><code>setText</code> updates text on every keystroke</li>
          <li>The input value is "controlled" by React state</li>
        </ul>
      </div>
    </div>
  );
};

// Example 3: Toggle Switch
const ToggleExample = () => {
  const [isOn, setIsOn] = useState(false); // Initial value is false

  const toggle = () => {
    setIsOn(!isOn); // Flip the boolean value
  };

  return (
    <div className="example-box">
      <h3>🔄 Toggle Switch Example</h3>
      <div className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={toggle}>
        <div className="toggle-button"></div>
      </div>
      <p className="toggle-status">
        Status: <span className={isOn ? 'on' : 'off'}>{isOn ? 'ON' : 'OFF'}</span>
      </p>
      <div className="explanation">
        <p><strong>How it works:</strong></p>
        <ul>
          <li><code>isOn</code> stores true/false value</li>
          <li><code>setIsOn(!isOn)</code> flips the value</li>
          <li>CSS classes change based on state</li>
        </ul>
      </div>
    </div>
  );
};

// Example 4: Array State (Shopping List)
const ShoppingListExample = () => {
  const [items, setItems] = useState([]); // Initial value is empty array
  const [newItem, setNewItem] = useState(''); // For the input field

  const addItem = () => {
    if (newItem.trim() !== '') {
      // Add new item to the array
      setItems([...items, newItem]); // Spread operator creates new array
      setNewItem(''); // Clear input
    }
  };

  const removeItem = (indexToRemove) => {
    // Remove item at specific index
    const updatedItems = items.filter((_, index) => index !== indexToRemove);
    setItems(updatedItems);
  };

  return (
    <div className="example-box">
      <h3>🛒 Shopping List Example</h3>
      <div className="input-group">
        <input 
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add item..."
          className="text-input"
        />
        <button onClick={addItem}>➕ Add</button>
      </div>
      <ul className="shopping-list">
        {items.map((item, index) => (
          <li key={index} className="shopping-item">
            {item}
            <button onClick={() => removeItem(index)} className="remove-btn">
              ❌
            </button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="empty-list">Your list is empty</p>}
      <div className="explanation">
        <p><strong>How it works:</strong></p>
        <ul>
          <li><code>items</code> stores array of shopping items</li>
          <li><code>setItems([...items, newItem])</code> adds new item</li>
          <li><code>filter()</code> removes items by creating new array</li>
        </ul>
      </div>
    </div>
  );
};

// Example 5: Object State (User Profile)
const UserProfileExample = () => {
  const [user, setUser] = useState({
    name: '',
    age: '',
    email: ''
  }); // Initial value is object

  const updateUser = (field, value) => {
    // Update specific field in the object
    setUser({
      ...user, // Keep all existing properties
      [field]: value // Update only the specific field
    });
  };

  const resetProfile = () => {
    setUser({ name: '', age: '', email: '' });
  };

  return (
    <div className="example-box">
      <h3>👤 User Profile Example</h3>
      <div className="form-group">
        <input 
          type="text"
          value={user.name}
          onChange={(e) => updateUser('name', e.target.value)}
          placeholder="Your name"
          className="text-input"
        />
        <input 
          type="number"
          value={user.age}
          onChange={(e) => updateUser('age', e.target.value)}
          placeholder="Your age"
          className="text-input"
        />
        <input 
          type="email"
          value={user.email}
          onChange={(e) => updateUser('email', e.target.value)}
          placeholder="Your email"
          className="text-input"
        />
      </div>
      <div className="profile-display">
        <h4>Profile Preview:</h4>
        <p><strong>Name:</strong> {user.name || 'Not provided'}</p>
        <p><strong>Age:</strong> {user.age || 'Not provided'}</p>
        <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
      </div>
      <button onClick={resetProfile}>🔄 Reset Profile</button>
      <div className="explanation">
        <p><strong>How it works:</strong></p>
        <ul>
          <li><code>user</code> stores object with multiple properties</li>
          <li><code>...user</code> spreads existing properties</li>
          <li><code>[field]: value</code> updates specific property</li>
        </ul>
      </div>
    </div>
  );
};

// Main component that displays all examples
const UseStateExamples = () => {
  return (
    <div className="examples-container">
      <div className="examples-header">
        <h1>🎓 Understanding useState Hook</h1>
        <p>Interactive examples showing how useState works in React</p>
      </div>
      
      <CounterExample />
      <TextInputExample />
      <ToggleExample />
      <ShoppingListExample />
      <UserProfileExample />
      
      <div className="summary-box">
        <h3>🎯 Key Points to Remember:</h3>
        <ul>
          <li><strong>State Persistence:</strong> State values persist between re-renders</li>
          <li><strong>Re-rendering:</strong> When you call setState, React re-renders the component</li>
          <li><strong>Immutability:</strong> Always create new objects/arrays, don't mutate existing ones</li>
          <li><strong>Initial Value:</strong> useState accepts any type: number, string, boolean, array, object</li>
          <li><strong>Multiple States:</strong> You can use multiple useState hooks in one component</li>
        </ul>
      </div>
    </div>
  );
};

export default UseStateExamples;
