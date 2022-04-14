import { v4 as uuidv4 } from 'uuid';

import { MathUtils } from './MathUtils';

type Point = { x: number; y: number };

export class Vector2D {
  id = uuidv4();

  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static random2D(): Vector2D {
    const vec = MathUtils.randomUnitVector();
    return new Vector2D(vec[0], vec[1]);
  }

  // the euclidean distance of the point
  static distBetween = (p1: Point, p2: Point): number =>
    Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

  dist = (p2: Point): number =>
    Math.sqrt((this.x - p2.x) ** 2 + (this.y - p2.y) ** 2);

  // set magnitude
  setMag(mag: number): void {
    const currentMag = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x = (this.x * mag) / currentMag;
    this.y = (this.y * mag) / currentMag;
  }

  add(a: Vector2D): void {
    this.x += a.x;
    this.y += a.y;
  }
}
