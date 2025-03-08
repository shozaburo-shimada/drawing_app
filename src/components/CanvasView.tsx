
import React from 'react';

interface CanvasViewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasView: React.FC<CanvasViewProps> = ({ canvasRef }) => {
  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={500}
      style={{ border: '1px solid black' }}
    />
  );
};

export default CanvasView;