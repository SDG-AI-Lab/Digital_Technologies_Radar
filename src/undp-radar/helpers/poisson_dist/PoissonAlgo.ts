/* eslint-disable no-plusplus */
import { MathUtils } from './MathUtils';
import { Vector2D } from './Vector2D';

/**
 * Poisson Distribution sampler
 *
 * Work based on The Coding Train, Coding Challenges
 * Episode 33
 * https://thecodingtrain.com/CodingChallenges/033-poisson-disc.html
 *
 * All acknowledgements for his amazing teaching effor are herby credited.
 */
export class PoissonAlgo {
  private R: number; // distance

  private k = 30; // limit of samples to choose before rejection

  private w: number;

  private cols: number;

  private rows: number;

  public grid: (Vector2D | null)[] = [];

  public active: Vector2D[] = [];

  public ordered: Vector2D[] = [];

  constructor(
    private width: number,
    private height: number,
    private opts?: {
      distance?: number;
      initialPoint?: { x: number; y: number };
    }
  ) {
    this.R = this.opts?.distance || 10;
    this.w = this.R / Math.sqrt(2);

    // STEP 0
    this.cols = Math.floor(this.width / this.w);
    this.rows = Math.floor(this.height / this.w);

    for (let i = 0; i < this.cols * this.rows; i++) {
      this.grid[i] = null;
    }
  }

  setup(): void {
    // STEP 1
    let x: number;
    let y: number;
    if (this.opts?.initialPoint) {
      x = this.opts?.initialPoint.x;
      y = this.opts?.initialPoint.y;
    } else {
      x = MathUtils.randomInt(this.width);
      y = MathUtils.randomInt(this.height);
    }

    const i = Math.floor(x / this.w);
    const j = Math.floor(y / this.w);
    const pos = new Vector2D(x, y);
    this.grid[i + j * this.cols] = pos;
    this.active.push(pos);
  }

  sample(iterations = 25): void {
    // STEP 2
    for (let total = 0; total < iterations; total++) {
      if (this.active.length > 0) {
        const randomIndex = Math.floor(MathUtils.randomInt(this.active.length));
        const pos = this.active[randomIndex];
        let found = false;

        if (pos)
          for (let n = 0; n < this.k; n++) {
            const sample = Vector2D.random2D();
            const mag = MathUtils.randIntBetween(this.R, 2 * this.R);
            sample.setMag(mag);
            sample.add(pos);

            // check new point
            const col = Math.floor(sample.x / this.w);
            const row = Math.floor(sample.y / this.w);

            if (
              col < this.cols &&
              row < this.rows &&
              !this.grid[col + row * this.cols]
            ) {
              let ok = true;
              for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                  const index = col + i + (row + j) * this.cols;
                  const neighbor = this.grid[index];
                  if (neighbor) {
                    const distance = sample.dist(neighbor);
                    if (distance < this.R) {
                      ok = false;
                    }
                  }
                }
              }
              if (ok) {
                found = true;
                this.grid[col + row * this.cols] = sample;
                this.active.push(sample);
                this.ordered.push(sample);
                // Should we break?
                break;
              }
            }
          }
        if (!found) {
          this.active.splice(randomIndex, 1);
        }
      }
    }
  }

  getNearesGridItem(pos: { x: number; y: number } | Vector2D): Vector2D {
    let vec: Vector2D;
    if (pos instanceof Vector2D) vec = pos;
    else vec = new Vector2D(pos.x, pos.y);
    return this.ordered.reduce((a, b) => (vec.dist(a) < vec.dist(b) ? a : b));
  }
}
