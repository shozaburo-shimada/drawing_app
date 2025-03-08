import { useEffect, useRef } from 'react';
import Paper from 'paper';

const usePaperSetup = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paperScope = useRef<paper.PaperScope | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const paperInstance = new Paper.PaperScope();
    paperScope.current = paperInstance;

    paperInstance.setup(canvasRef.current);

    return () => {
      if (paperInstance && paperInstance.project) {
        paperInstance.project.clear();
      }
    };
  }, []);

  return { canvasRef, paperScope };
};

export default usePaperSetup;