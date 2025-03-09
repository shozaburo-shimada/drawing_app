import Paper from 'paper';

export interface Point {
  marker: paper.Shape.Circle;
}

export interface TargetPoint {
  segment: paper.Segment | null;
  marker: paper.Shape.Circle | null;
}