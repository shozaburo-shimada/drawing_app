import React from 'react';

interface ToolbarProps {
  isDrawing: boolean;
  toggleDrawing: () => void;
  isErasing: boolean;
  toggleErasing: () => void;
}
//const Toolbar = ({ isDrawing, toggleDrawing, isErasing, toggleErasing }) => {/
const Toolbar: React.FC<ToolbarProps> = ({ isDrawing, toggleDrawing, isErasing, toggleErasing }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
      <button onClick={toggleDrawing} className={isDrawing ? "bg-blue-500" : ""}>
        {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
      </button>
      <button onClick={toggleErasing} className={isErasing ? "bg-yellow-500" : ""}>
        {isErasing ? 'Stop Erasing' : 'Start Erasing'}
      </button>
    </div>
  );
};

export default Toolbar;