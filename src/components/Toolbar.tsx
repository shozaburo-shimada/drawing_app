import React from 'react';
import Button from "@mui/material/Button";

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
    <div style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
      <Button variant='outlined' onClick={toggleMoving} className={isMoving ? "bg-blue-500" : ""}>
        {isMoving ? 'Stop Moving' : 'Start Moving'}
      </Button>
      <Button variant='outlined' onClick={toggleDrawing} className={isDrawing ? "bg-blue-500" : ""}>
        {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
      </Button>
      <Button variant='outlined' onClick={toggleErasing} className={isErasing ? "bg-yellow-500" : ""}>
        {isErasing ? 'Stop Erasing' : 'Start Erasing'}
      </Button>
    </div>
  );
};

export default Toolbar;