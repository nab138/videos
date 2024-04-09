import { makeScene2D } from "@motion-canvas/2d";
import { Robot, drawPoint, drawRect, drawSpline } from "../utils";
import {
  Vector2,
  all,
  delay,
  linear,
  sequence,
  waitFor,
  easeInElastic,
  waitUntil,
} from "@motion-canvas/core";
import { MainColors } from "../styles";

export default makeScene2D(function* (view) {
  let fieldScale = 85;
  let field = drawRect(
    view,
    new Vector2(0, 0),
    0,
    0,
    MainColors.interactionArea,
    5,
    15
  );

  let dozer = Robot.dozer(field(), new Vector2(-500, 200), fieldScale);
  dozer.body().rotation(50);

  yield* sequence(
    0.7,
    all(field().width(16.5 * fieldScale, 1), field().height(8 * fieldScale, 1)),
    dozer.animateIn(1)
  );

  // Draw 3 red rectangles with varying positions and sizes on the field manually
  let rects = [];
  rects.push(
    drawRect(
      field(),
      new Vector2(-150, 100),
      0,
      0,
      MainColors.obstacles,
      2,
      15,
      MainColors.border,
      10
    )
  );
  rects.push(
    drawRect(
      field(),
      new Vector2(-450, -200),
      0,
      0,
      MainColors.obstacles,
      2,
      15,
      MainColors.border,
      -15
    )
  );
  rects.push(
    drawRect(field(), new Vector2(300, 0), 0, 0, MainColors.obstacles, 2, 15)
  );

  let sizes = [
    new Vector2(100, 300),
    new Vector2(150, 150),
    new Vector2(300, 300),
  ];

  let generators = [];
  for (let obs in rects) {
    generators.push(
      all(
        rects[obs]().width(sizes[obs].x, 1),
        rects[obs]().height(sizes[obs].y, 1)
      )
    );
  }

  let target = drawPoint(field(), new Vector2(575, 0), 0, MainColors.path, 2);
  yield* waitFor(2);
  yield* sequence(0.5, ...generators);
  yield* delay(1, target().size(35, 0.8));
  let spline = drawSpline(
    field(),
    [
      new Vector2(-455, 160),
      new Vector2(-200, -170),
      new Vector2(0, -170),
      new Vector2(50, 200),
      new Vector2(550, 200),
      new Vector2(575, 0),
    ],
    10,
    MainColors.path
  );
  spline().end(0);
  yield* delay(1, spline().end(1, 3, linear));
  yield* waitUntil("robotDrive");
  yield* all(
    dozer
      .body()
      .position(spline().getPointAtPercentage(0).position, 0.25, linear),
    dozer
      .body()
      .rotation(
        spline().getPointAtPercentage(0).normal.degrees + 180,
        0.25,
        linear
      )
  );
  for (let i = 0; i < 1; i += 0.004) {
    yield* all(
      dozer
        .body()
        .position(spline().getPointAtPercentage(i).position, 0.03, linear),
      dozer
        .body()
        .rotation(
          spline().getPointAtPercentage(i).normal.degrees + 180,
          0.03,
          linear
        ),
      spline().start(i + 0.02, 0.03, linear)
    );
  }

  yield* waitUntil("introDone");

  yield* sequence(
    0.2,
    target().size(40, 0.08).to(0, 0.65),
    ...rects.map((rect) =>
      all(
        rect()
          .width(rect().width() + 10, 0.08)
          .to(0, 0.65),
        rect()
          .height(rect().height() + 10, 0.08)
          .to(0, 0.65)
      )
    ),
    dozer.animateOut(0.75, easeInElastic)
  );
});
