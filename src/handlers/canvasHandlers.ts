import Paper from 'paper';
import { DraggedItem, Point } from '../types/paperTypes';

interface CanvasHandlersProps {
  isDrawing: boolean;
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
  isDrawing,
  pointsRef,
  draggedItemRef,
  currentPath,
  setCurrentPath,
  paperScope,
}: CanvasHandlersProps) => {
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
      draggedItemRef.current = null;
    }
  };

  const handleMouseDrag = (event: paper.ToolEvent) => {
    //非Drawモード時
    if (!isDrawing) {
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