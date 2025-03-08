import React, { useState, useEffect, useRef } from 'react';
import Paper from 'paper';

interface Point {
  marker: paper.Shape.Circle;
  connections: paper.Path.Line[];
  segment?: paper.Segment;
}

const Canvas = () => {
  const canvasRef = useRef(null);
  const toolRef = useRef<paper.Tool | null>(null);

  //Flag
  const [isDrawing, setIsDrawing] = useState(false)
  const [isErasing, setIsErasing] = useState(false)
  //const hitRef = useRef<paper.HitResult | null>(null)
  const hitRef = useRef<{ point: Point, segment: paper.Segment } | null>(null)

  //頂点(point)の保存
  const pointsRef = useRef<Point[]>([])
  const [currentPath, setCurrentPath] = useState<paper.Path | null>(null);

  // Paper.jsの初期化
  useEffect(() => {
    // canvasが準備できたらpaper.jsを初期化
    if (!canvasRef.current) return;
    Paper.setup(canvasRef.current);

    // クリーンアップ
    return () => {
      Paper.project.clear()
      if (toolRef.current) {
        toolRef.current.remove()
      }
    }
  }, [])

  // ツールとイベントハンドラーの設定
  useEffect(() => {
    if (!Paper.project) return;

    // 既存のツールを削除
    if (toolRef.current) {
      toolRef.current.remove()
    }
    // 新しいツールを設定
    const tool = new Paper.Tool();
    toolRef.current = tool;

    tool.onMouseMove = (event: paper.ToolEvent) => {
      handleMouseMove(event);
    }

    tool.onMouseDown = (event: paper.ToolEvent) => {
      handleMouseDown(event);
    }

    tool.onMouseUp = (event: paper.ToolEvent) => {
      handleMouseUp(event);
    }

    tool.onMouseDrag = (event: paper.ToolEvent) => {
      handleMouseDrag(event);
    }

    return () => {
      tool.remove()
    }
  }, [isDrawing, isErasing, currentPath, hitRef, pointsRef])


  const toggleDrawing = () => {

    setIsDrawing(!isDrawing)
    setCurrentPath(null)

  }

  const toggleErasing = () => { }

  const handleMouseMove = (event) => {

  }

  const handleMouseDown = (event) => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    //非Drawモード時
    if (!isDrawing) {
      //クリックでパスの操作
      const hitResult = Paper.project.hitTest(event.point, {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 5
      });

      /*
      //Segment(頂点)にヒットしたかどうか？
      let activeSegment = hitResult && hitResult.segment
      if (activeSegment) {
        console.log('Hit Segment position', activeSegment.point)
        hitRef.current = activeSegment;
        //対応するmarkerを検索する
      }
      */
      if (hitResult) {
        // セグメントにヒットした場合
        if (hitResult.segment) {
          console.log('Hit Segment position', hitResult.segment.point);

          // セグメントと対応するポイントを特定
          const path = hitResult.segment.path;
          const segmentIndex = hitResult.segment.index;

          // currentPathとセグメントが関連している場合
          if (path === currentPath) {
            // 対応するマーカーを検索
            const point = pointsRef.current[segmentIndex];
            if (point) {
              hitRef.current = { point, segment: hitResult.segment };
            }
          }
        }
        // マーカー（円）にヒットした場合
        else if (hitResult.item && hitResult.item instanceof Paper.Shape.Circle) {
          const hitMarker = hitResult.item as paper.Shape.Circle;

          // マーカーに対応するポイントを検索
          const pointIndex = pointsRef.current.findIndex(p => p.marker === hitMarker);
          if (pointIndex >= 0 && currentPath) {
            const point = pointsRef.current[pointIndex];
            const segment = currentPath.segments[pointIndex];
            if (segment) {
              hitRef.current = { point, segment };
            }
          }
        }
      }
    }

    //Drawモード時
    if (isDrawing) {
      //頂点にマーカー設置
      const marker = new Paper.Shape.Circle({
        center: event.point,
        radius: 3,
        fillColor: 'rgb(64, 64, 64)',
      });
      /*
      //頂点を保存
      pointsRef.current.push({ marker: marker, connections: [] })

      if (!currentPath) {
        const newPath = new Paper.Path();
        newPath.strokeColor = new Paper.Color('black');
        newPath.add(event.point);
        setCurrentPath(newPath);

      } else {
        currentPath.add(event.point);
      }
      */
      const newPoint: Point = { marker: marker, connections: [] };

      if (!currentPath) {
        const newPath = new Paper.Path();
        newPath.strokeColor = new Paper.Color('black');
        const segment = newPath.add(event.point);
        newPoint.segment = segment; // セグメントを関連付け
        setCurrentPath(newPath);
      } else {
        const segment = currentPath.add(event.point);
        newPoint.segment = segment; // セグメントを関連付け
      }

      //頂点を保存
      pointsRef.current.push(newPoint);

    }
  }

  const handleMouseUp = (event) => {

    if (hitRef.current) {
      console.log('handleMouseUp');
      hitRef.current = null;
    }

  }

  const handleMouseDrag = (event) => {

    if (hitRef.current) {
      /*
      //Segmentの移動
      hitRef.current.point = event.point;
      //Markerの移動
      let idx = hitRef.current.index;
      console.log(idx);
      pointsRef.current[idx].marker.position = event.point;
      */
      const { point, segment } = hitRef.current;

      // セグメントの移動
      segment.point = event.point;

      // マーカーの移動
      point.marker.position = event.point;
    }
  }


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