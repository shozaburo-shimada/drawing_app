import React, { useState, useEffect, useRef } from 'react';
import paper from 'paper';

// マウスポインターの座標
interface Point {
  x: number;
  y: number;
}

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false)
  const [isErasing, setIsErasing] = useState(false)
  //頂点(point)の保存
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null)
  const [points, setPoints] = useState<Point[]>([])
  //パス(path)の保存
  const [currentPath, setCurrentPath] = useState<paper.Path | null>(null);
  const [paths, setPaths] = useState<paper.Path[]>([]);
  //未確定パス
  const [previewPath, setPreviewPath] = useState<paper.Path | null>(null);
  //選択パス
  const [selectedPoint, setSelectedPoint] = useState<paper.Path | null>(null);


  useEffect(() => {
    // canvasが準備できたらpaper.jsを初期化
    if (canvasRef.current) {
      paper.setup(canvasRef.current);

      // 任意で、交差判定などの処理もここで行えます。


    }
    // クリーンアップ処理 (コンポーネントがアンマウントされた時)
    return () => {
      paper.project.clear();  // 既存のpaper.jsプロジェクトをクリア
    };
  }, []);

  const toggleDrawing = () => {

    //Draw終了時、プレビューパスを消す
    if (isDrawing) {
      if (previewPath) previewPath.remove();
    }

    setIsDrawing(!isDrawing)
    setCurrentPath(null)

  }

  const toggleErasing = () => { }

  const handleMouseMove: React.MouseEvent<HTMLCanvasElement> = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // クリックした座標を取得
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    //マウスポインタ近くのパスを探索
    let pathFound = null;


    //Drawモード時に、未確定パスのプレビュー
    if (isDrawing && currentPath) {
      if (previewPath) previewPath.remove();

      const newPreviewPath = new paper.Path();
      newPreviewPath.strokeColor = new paper.Color('black');
      newPreviewPath.add(new paper.Point(currentPoint.x, currentPoint.y));
      newPreviewPath.add(new paper.Point(x, y));
      setPreviewPath(newPreviewPath);
    }

  }

  const handleMouseDown: React.MouseEvent<HTMLCanvasElement> = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // クリックした座標を取得
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clickedPoint = new paper.Point(x, y);

    //非Drawモード時
    if (!isDrawing) {
      //頂点をクリックしたかどうか
      let pointFound = null;
      for (let point of points) {
        const nearestPoint = point.getNearestPoint(clickedPoint);
        if (nearestPoint.getDistance(clickedPoint) < 5) {
          pointFound = point;
          break;
        }
      }
      //頂点をクリックした場合、選択パスを更新
      if (pointFound) {
        setSelectedPoint(pointFound);
        pointFound.onMouseDrag = (event: paper.ToolEvent) => {
          pointFound.position = pointFound.position.add(event.delta);
        };
      }

    }

    //Drawモード時
    if (isDrawing) {
      //頂点にマーカー設置
      const marker = new paper.Shape.Circle({
        center: [x, y],
        radius: 3,
        fillColor: 'rgb(64, 64, 64)',
      });
      //設置したマーカーを保存
      setCurrentPoint({ x: x, y: y });
      setPoints((prev) => [...prev, currentPoint]);

      if (!currentPath) {
        //始点を置く
        const newPath = new paper.Path();
        newPath.strokeColor = new paper.Color('black');
        newPath.add(new paper.Point(x, y));
        setCurrentPath(newPath);
      } else {
        //線を引く
        currentPath.add(new paper.Point(x, y));
      }
    }
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        style={{ border: '1px solid black' }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
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