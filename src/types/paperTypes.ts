import Paper from 'paper';

export interface Point {
  marker: paper.Shape.Circle;
}

export interface DraggedItem {
  segment?: paper.Segment;
  index: number;
}