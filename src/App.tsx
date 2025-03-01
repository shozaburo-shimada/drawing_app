import React from 'react';
import Canvas from './PaperCanvas.tsx';
const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React + Paper.js での2D CAD</h1>
      <Canvas />
    </div>
  );
};
export default App;
