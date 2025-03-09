
import React from 'react';

interface CanvasViewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasView: React.FC<CanvasViewProps> = ({ canvasRef }) => {
  return (
    <canvas
      ref={canvasRef}
      width={891}
      height={530}
      style={{ border: '1px solid black', backgroundColor: 'white' }}
    />
  );
};

export default CanvasView;