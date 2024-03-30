import { makeScene2D } from '@motion-canvas/2d';
import { drawLine, drawPoints } from '../utils';
import { Vector2, easeInOutQuad, easeOutQuad, sequence} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  let positions = [
    new Vector2(-100, 120),
    new Vector2(100, 120),
    new Vector2(100, -80),
    new Vector2(0, -200),
    new Vector2(-100, -80),
  ]
  
  let circles = drawPoints(view, positions, 0, "#c76c32");

  let line = drawLine(view, positions, 10, "#c76c32", true);
  line().endOffset(line().percentageToDistance(1))
  yield* sequence(0.1, ...circles.map((circle) => circle().size(30, 0.8, easeOutQuad)));
  yield* line().endOffset(0, 1, easeInOutQuad);
});
