import Paper from 'paper';
import { TargetPoint, Point } from '../types/paperTypes';

/* 
  Closure
  各種イベントハンドラーを返す関数
*/

export const createCanvasHandlers = ({
  isMoving,
  isDrawing,
  isErasing,
  pointsRef,
  currentPath,
  setCurrentPath,
  paperScope,
}) => {
  let draggedPoint: TargetPoint | null = null;

  const handleMouseDown = (event: paper.ToolEvent) => {
    if (!paperScope.current) return;
    const paper = paperScope.current;

    console.log('Mouse Down');

    //Movingモード時
    if (isMoving) {
      const targetSegment = hitSegment(paper, event, pointsRef);
      //セグメントがヒットした場合
      if (targetSegment.segment) {
        console.log('Hit', targetSegment.segment);

        draggedPoint = {
          segment: targetSegment.segment,
          marker: targetSegment.marker
        }
        console.log('Hit', draggedPoint);
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
      const targetSegment = hitSegment(paper, event, pointsRef);
      // セグメントがヒットした場合
      if (targetSegment.segment) {
        console.log('Hit', targetSegment.segment);
        targetSegment.marker?.remove();
        targetSegment.segment.remove();


      }
    }
  };

  const handleMouseUp = () => {
    console.log('Mouse Up');
    if (draggedPoint) {
      draggedPoint = null;
    }
  };

  const handleMouseDrag = (event: paper.ToolEvent) => {
    console.log('Mouse Drag');
    //Movingモード時
    if (isMoving) {
      if (draggedPoint) {
        const { segment, marker } = draggedPoint;
        segment.point = event.point;
        marker.position = event.point;
      }
    }
  };

  return { handleMouseDown, handleMouseUp, handleMouseDrag };
};

//頂点への当たり判定
function hitSegment(paper, event, pointsRef) {
  let targetSegment: TargetPoint = { segment: null, marker: null };

  let hitResult = paper.project.hitTest(event.point, {
    segments: true,
    stroke: false,
    fill: false,
    tolerance: 10
  });

  // セグメントへのヒット
  if (hitResult && hitResult.segment) {
    targetSegment.segment = hitResult.segment;

    //セグメントに対応するマーカーを探す
    const marker_idx = pointsRef.current.findIndex(p => p.marker.position.equals(hitResult.segment.point));
    targetSegment.marker = pointsRef.current[marker_idx].marker;
  }

  return targetSegment;
}

