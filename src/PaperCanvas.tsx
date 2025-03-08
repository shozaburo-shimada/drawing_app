import React, { useState, useEffect, useRef } from 'react';
import Paper from 'paper';

// 型定義
import { Point, DraggedItem } from './types/paperTypes';

// フック
//import usePaperSetup from './hooks/usePaperSetup';

//イベントハンドラー
import { createCanvasHandlers } from './handlers/canvasHandlers.ts';

//UIコンポーネント
import CanvasView from './components/CanvasView.tsx';
import Toolbar from './components/Toolbar.tsx';

const Canvas = () => {
  const canvasRef = useRef(null);
  const toolRef = useRef<paper.Tool | null>(null);
  const paperScope = useRef<paper.PaperScope | null>(null);

  // Flag
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  // 頂点(point)の保存
  const pointsRef = useRef<Point[]>([]);
  const [currentPath, setCurrentPath] = useState<paper.Path | null>(null);

  // ドラッグ中のアイテム
  const draggedItemRef = useRef<DraggedItem | null>(null);


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
  }, [isDrawing, isErasing, currentPath, draggedItemRef, pointsRef]);

  //各種イベントハンドラー
  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
    if (currentPath) {
      setCurrentPath(null);
    }
    setIsErasing(false);
  };

  const toggleErasing = () => {
    setIsErasing(!isErasing);
    setIsDrawing(false);
  };

  const { handleMouseDown, handleMouseUp, handleMouseDrag } = createCanvasHandlers({
    isDrawing,
    pointsRef,
    draggedItemRef,
    currentPath,
    setCurrentPath,
    paperScope,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <CanvasView canvasRef={canvasRef} />
      <Toolbar
        isDrawing={isDrawing}
        toggleDrawing={toggleDrawing}
        isErasing={isErasing}
        toggleErasing={toggleErasing}
      />
    </div>
  );
};

export default Canvas;