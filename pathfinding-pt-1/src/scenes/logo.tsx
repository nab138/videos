import { Txt, makeScene2D } from "@motion-canvas/2d";
import { Robot, drawPoint, drawRect, drawSpline } from "../utils";
import { Vector2, waitUntil, createRef } from "@motion-canvas/core";
import Colors from "../colors";
import "../font.css";

export default makeScene2D(function* (view) {
  let fieldScale = 85;
  let field = drawRect(
    view,
    new Vector2(0, 0),
    16 * fieldScale,
    4 * fieldScale,
    Colors.interactionArea,
    5,
    15
  );

  let dozer = Robot.dozer(field(), new Vector2(-500, 200), fieldScale);
  dozer.body().rotation(50);

  // let obstacle = drawRect(
  //   field(),
  //   new Vector2(300, 0),
  //   100,
  //   300,
  //   Colors.obstacles,
  //   2,
  //   15
  // );
  let text = createRef<Txt>();
  field().add(
    <Txt ref={text} fill={Colors.text} fontFamily={Colors.font} fontSize={200}>
      Oxplorer
    </Txt>
  );

  let spline = drawSpline(
    field(),
    [
      new Vector2(-550, 0),
      new Vector2(-450, 80),
      new Vector2(-400, 90),
      new Vector2(-300, 90),
      new Vector2(-250, 90),
      new Vector2(-150, 140),
      new Vector2(0, 90),
      new Vector2(450, 100),
      new Vector2(540, -10),
    ],
    10,
    Colors.path
  );
  spline().lineDash([20, 15 ]);
  dozer.body().position(spline().getPointAtPercentage(1).position),
    dozer
      .body()
      .rotation(spline().getPointAtPercentage(1).normal.degrees + 180);

  yield* waitUntil("introDone");
});
