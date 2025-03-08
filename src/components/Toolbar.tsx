import React from 'react';

interface ToolbarProps {
  isMoving: boolean;
  toggleMoving: () => void;
  isDrawing: boolean;
  toggleDrawing: () => void;
  isErasing: boolean;
  toggleErasing: () => void;
}
//const Toolbar = ({ isDrawing, toggleDrawing, isErasing, toggleErasing }) => {/
const Toolbar: React.FC<ToolbarProps> = ({ isMoving, toggleMoving, isDrawing, toggleDrawing, isErasing, toggleErasing }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
      <button onClick={toggleMoving} className={isMoving ? "bg-blue-500" : ""}>
        {isMoving ? 'Stop Moving' : 'Start Moving'}
      </button>
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