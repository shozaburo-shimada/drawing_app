import Paper from 'paper';
import { DraggedItem, Point } from '../types/paperTypes';

interface CanvasHandlersProps {
  isMoving: boolean;
  isDrawing: boolean;
  isErasing: boolean;
  pointsRef: React.MutableRefObject<Point[]>;
  draggedItemRef: React.MutableRefObject<DraggedItem | null>;
  currentPath: paper.Path | null;
  setCurrentPath: React.Dispatch<React.SetStateAction<paper.Path | null>>;
  paperScope: React.MutableRefObject<paper.PaperScope | null>;
}

/* closure
  各種イベントハンドラーを返す関数
*/
export const createCanvasHandlers = ({
  isMoving,
  isDrawing,
  isErasing,
  pointsRef,
  draggedItemRef,
  currentPath,
  setCurrentPath,
  paperScope,
}: CanvasHandlersProps) => {
  const handleMouseDown = (event: paper.ToolEvent) => {
    if (!paperScope.current) return;
    const paper = paperScope.current;

    //Movingモード時
    if (isMoving) {
      // セグメントのヒットテスト
      let hitResult = paper.project.hitTest(event.point, {
        segments: true,
        stroke: false,
        fill: false,
        tolerance: 5
      });

      // セグメントへのヒット
      if (hitResult && hitResult.segment) {
        const segment = hitResult.segment;
        const index = segment.index;

        //セグメントに対応するマーカーを探す
        const marker_idx = pointsRef.current.findIndex(p => p.marker.position.equals(segment.point));

        draggedItemRef.current = {
          segment: segment,
          index: marker_idx
        };
      }
    }

    // Drawモード時
    if (isDrawing) {
      // 頂点にマーカー設置
      const marker = new paper.Shape.Circle({
        center: event.point,
        radius: 4,
        fillColor: 'rgb(255, 255, 255)',
        strokeColor: 'black',
      });

      // 頂点を保存
      pointsRef.current.push({ marker: marker });

      if (!currentPath) {
        const newPath = new paper.Path();
        newPath.strokeColor = new paper.Color('black');
        newPath.add(event.point);
        setCurrentPath(newPath);
      } else {
        currentPath.add(event.point);
      }
    }

    // Eraseモード時
    if (isErasing) {

      // セグメントのヒットテスト
      let hitResult = paper.project.hitTest(event.point, {
        segments: true,
        stroke: false,
        fill: false,
        tolerance: 5
      });

      // セグメントへのヒット
      if (hitResult && hitResult.segment) {
        const segment = hitResult.segment;
        const index = segment.index;

        //セグメントに対応するマーカーを探す
        const marker_idx = pointsRef.current.findIndex(p => p.marker.position.equals(segment.point));

        console.log(pointsRef.current);
        console.log('Delete: ', marker_idx);

        //削除
        console.log(pointsRef.current);
        pointsRef.current[marker_idx].marker.remove();
        pointsRef.current.splice(marker_idx, 1);
        segment.remove();
      }

    }
  };

  const handleMouseUp = () => {
    if (draggedItemRef.current) {
      draggedItemRef.current = null;
    }
  };

  const handleMouseDrag = (event: paper.ToolEvent) => {
    //Movingモード時
    if (isMoving) {
      if (!draggedItemRef.current) return;
      const { segment, index } = draggedItemRef.current;

      // セグメントとマーカーを移動
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

  return { handleMouseDown, handleMouseUp, handleMouseDrag };
};

//頂点への当たり判定
function hitSegment(paper, event, pointsRef) {
  let segment = null;
  let index = null;
  let marker_idx = null;
  // セグメントのヒットテスト
  let hitResult = paper.project.hitTest(event.point, {
    segments: true,
    stroke: false,
    fill: false,
    tolerance: 5
  });

  // セグメントへのヒット
  if (hitResult && hitResult.segment) {
    segment = hitResult.segment;
    index = segment.index;

    //セグメントに対応するマーカーを探す
    marker_idx = pointsRef.current.findIndex(p => p.marker.position.equals(segment.point));
  }

  return { segment, marker_idx };
}