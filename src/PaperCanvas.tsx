import React, { useState, useEffect, useRef } from 'react';
import Paper from 'paper';

// 型定義
import { Point, TargetItem } from './types/paperTypes';

// フック
//import usePaperSetup from './hooks/usePaperSetup';

//イベントハンドラー
import { createCanvasHandlers } from './handlers/canvasHandlers.ts';

//UIコンポーネント
import CanvasView from './components/CanvasView.tsx';
import Toolbar from './components/Toolbar.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';

const Canvas = () => {
  const canvasRef = useRef(null);
  const toolRef = useRef<paper.Tool | null>(null);
  const paperScope = useRef<paper.PaperScope | null>(null);

  // Flag
  const [isMoving, setIsMoving] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  // Settings
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [strokeColor, setStrokeColor] = useState('black');
  const [angle, setAngle] = useState(0);

  // 頂点(point)の保存
  const pointsRef = useRef<Point[]>([]);
  const [currentPath, setCurrentPath] = useState<paper.Path | null>(null);

  // Paper.jsの初期化
  useEffect(() => {
    if (!canvasRef.current) return;

    // 新しいPaperScopeを作成して保存
    const paperInstance = new Paper.PaperScope();
    paperScope.current = paperInstance;

    // このスコープでキャンバスを設定
    paperInstance.setup(canvasRef.current);

    return () => {
      if (paperInstance && paperInstance.project) {
        paperInstance.project.clear();
      }
      if (toolRef.current) {
        toolRef.current.remove();
      }
    };
  }, []);

  // ツールとイベントハンドラーの設定
  useEffect(() => {
    if (!paperScope.current || !paperScope.current.project) return;

    const paper = paperScope.current;

    // 既存のツールを削除
    if (toolRef.current) {
      toolRef.current.remove();
    }

    // 新しいツールを設定
    const tool = new paper.Tool();
    toolRef.current = tool;

    tool.onMouseDown = handleMouseDown;
    tool.onMouseUp = handleMouseUp;
    tool.onMouseDrag = handleMouseDrag;

    return () => {
      if (tool) tool.remove();
    };
  }, [isMoving, isDrawing, isErasing, currentPath]);

  //各種イベントハンドラー
  const toggleMoving = () => {
    setIsMoving(!isMoving);
    setIsDrawing(false);
    setIsErasing(false);
  };

  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
    if (currentPath) {
      setCurrentPath(null);
    }
    setIsMoving(false);
    setIsErasing(false);
  };

  const toggleErasing = () => {
    setIsErasing(!isErasing);
    setIsMoving(false);
    setIsDrawing(false);
  };

  const handleSettingsChange = (settings: { x: number; y: number; strokeWidth: number; strokeColor: string; angle: number }) => {
    setX(settings.x);
    setY(settings.y);
    setStrokeWidth(settings.strokeWidth);
    setStrokeColor(settings.strokeColor);
    setAngle(settings.angle);
  };

  const { handleMouseDown, handleMouseUp, handleMouseDrag } = createCanvasHandlers({
    isMoving,
    isDrawing,
    isErasing,
    pointsRef,
    currentPath,
    setCurrentPath,
    paperScope,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <Toolbar
        isMoving={isMoving}
        toggleMoving={toggleMoving}
        isDrawing={isDrawing}
        toggleDrawing={toggleDrawing}
        isErasing={isErasing}
        toggleErasing={toggleErasing}
      />
      <CanvasView canvasRef={canvasRef} />
      <SettingsPanel
        x={x}
        y={y}
        strokeWidth={strokeWidth}
        strokeColor={strokeColor}
        angle={angle}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};

export default Canvas;