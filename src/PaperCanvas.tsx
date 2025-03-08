import React, { useState, useEffect, useRef } from 'react';
import Paper from 'paper';

interface Point {
  marker: paper.Shape.Circle;
  connections: paper.Path.Line[];
}

const Canvas = () => {
  const canvasRef = useRef(null);
  const toolRef = useRef<paper.Tool | null>(null);
  const paperScope = useRef<paper.PaperScope | null>(null);

  // Flag
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  // ドラッグ操作のための参照
  const draggedItemRef = useRef<{
    segment?: paper.Segment;
    //marker?: paper.Shape.Circle;
    index: number; //markerのindex
  } | null>(null);

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

  const handleMouseDown = (event: paper.ToolEvent) => {
    if (!paperScope.current) return;
    const paper = paperScope.current;

    // 非Drawモード時
    if (!isDrawing) {
      // セグメントのヒットテスト
      let hitResult = paper.project.hitTest(event.point, {
        segments: true,
        stroke: false,
        fill: false,
        tolerance: 10
      });

      // セグメントへのヒット
      if (hitResult && hitResult.segment) {// hitResult自体がnullでないかどうかもチェック
        const segment = hitResult.segment;
        const index = segment.index;

        //セグメントに対応するマーカーを探す
        const marker_idx = pointsRef.current.findIndex(p => p.marker.position.equals(segment.point));
        console.log('Marker hit at index:', marker_idx);

        draggedItemRef.current = {
          segment: segment,
          //marker: pointsRef.current[marker_idx].marker,
          index: marker_idx
        };
      }
    }

    // Drawモード時
    if (isDrawing) {
      // 頂点にマーカー設置
      const marker = new paper.Shape.Circle({
        center: event.point,
        radius: 5,
        fillColor: 'rgb(64, 64, 64)',
      });

      // 頂点を保存
      pointsRef.current.push({ marker: marker, connections: [] });

      if (!currentPath) {
        const newPath = new paper.Path();
        newPath.strokeColor = new paper.Color('black');
        newPath.add(event.point);
        setCurrentPath(newPath);
      } else {
        currentPath.add(event.point);
      }
    }
  };

  const handleMouseUp = () => {
    if (draggedItemRef.current) {
      console.log('Drag operation completed');
      draggedItemRef.current = null;
    }
  };

  const handleMouseDrag = (event: paper.ToolEvent) => {
    //非Drawモード時
    if (!isDrawing) {
      if (!draggedItemRef.current) return;
      const { segment, index } = draggedItemRef.current;

      // セグメントまたはマーカーを移動
      if (segment) {
        // セグメントを移動
        segment.point = event.point;

        // 対応するマーカーも移動
        const point = pointsRef.current[index];
        if (point && point.marker) {
          point.marker.position = event.point;
        }
      }
    }

  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        style={{ border: '1px solid black' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
        <button onClick={toggleDrawing} className={isDrawing ? "bg-blue-500" : ""}>
          {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
        </button>
        <button onClick={toggleErasing} className={isErasing ? "bg-yellow-500" : ""}>
          {isErasing ? 'Stop Erasing' : 'Start Erasing'}
        </button>
      </div>
    </div>
  );
};

export default Canvas;