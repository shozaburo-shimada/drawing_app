import Paper from 'paper';

export interface Point {
  marker: paper.Shape.Circle;
  connections: paper.Path.Line[];
}

export interface DraggedItem {
  segment?: paper.Segment;
  index: number;
}