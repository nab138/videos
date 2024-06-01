import { Camera, Circle, Grid, Txt, makeScene2D } from "@motion-canvas/2d";
import {
  Color,
  Direction,
  Vector2,
  all,
  chain,
  createRef,
  easeInOutQuad,
  sequence,
  slideTransition,
  tween,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Robot, VisualVector, drawLine, drawPoint, drawRect } from "../utils";
import { Fonts, MainColors } from "../styles";

export default makeScene2D(function* (view) {
  let fieldScale = 90;
  let camera = createRef<Camera>();
  let field = createRef<Grid>();

  view.add(
    <Camera ref={camera}>
      <Grid
        ref={field}
        width={"100%"}
        height={"100%"}
        stroke={"#666"}
        lineWidth={3}
        spacing={fieldScale}
      />
    </Camera>
  );

  yield* all(slideTransition(Direction.Bottom, 1), field().stroke("#444", 1));
  yield* waitUntil("Robot");
  let dozer = Robot.dozer(field(), new Vector2(0, 0), fieldScale * 2);
  let center = drawPoint(dozer.body(), new Vector2(0, 0), 0, MainColors.path);
  yield* all(dozer.animateIn(1), center().size(25, 1));
  let obs = drawRect(
    field(),
    new Vector2(0, 0),
    0,
    0,
    MainColors.obstacles,
    2,
    15,
    MainColors.border,
    10
  );
  obs().zIndex(9999999);
  let invisibleCircle = createRef<Circle>();
  obs().add(<Circle ref={invisibleCircle} size={353.55} />);
  yield* waitUntil("Obstacle");
  yield* all(
    dozer.body().position([-300, 0], 1),
    obs().size(new Vector2(250, 250), 1)
  );
  yield* waitUntil("Inside");
  yield* chain(
    all(
      dozer
        .body()
        .position(invisibleCircle().getPointAtPercentage(0.5).position, 1),
      dozer
        .body()
        .rotation(
          (invisibleCircle().getPointAtPercentage(0.5).normal.degrees + 180) %
            360,
          1
        )
    ),
    tween(3, (tRaw) => {
      let t = easeInOutQuad(tRaw) + 0.5;
      if (t > 1) t -= 1;
      dozer.body().position(invisibleCircle().getPointAtPercentage(t).position);
      dozer
        .body()
        .rotation(
          invisibleCircle().getPointAtPercentage(t).normal.degrees + 180
        );
    })
  );
  invisibleCircle().remove();
  yield* waitUntil("Bigger");
  let obsOutline = drawRect(
    obs(),
    new Vector2(0, 0),
    250,
    250,
    new Color("#00000000"),
    5,
    15,
    MainColors.obstacles.brighten(0.5),
    0
  );
  yield* all(
    dozer.body().position([-258, 0], 1),
    obsOutline().size([508.38, 508.38], 1)
  );
  let unRotatedPos = obsOutline().getPointAtPercentage(0.85).position;
  // Need to rotate the position around the center of the circle
  let rotatedPos = unRotatedPos.rotate(10, [0, 0]);
  yield* chain(
    dozer.body().position(rotatedPos, 0.05),
    tween(6, (tRaw) => {
      let t = easeInOutQuad(tRaw) + 0.85;
      if (t > 1) t -= 1;
      let unRotatedPos = obsOutline().getPointAtPercentage(t).position;
      // Need to rotate the position around the center of the circle
      let rotatedPos = unRotatedPos.rotate(10, [0, 0]);
      dozer.body().position(rotatedPos);
      let rot = ((tRaw * 3) % 3) * 360;
      dozer.body().rotation(rot);
    })
  );
  yield* waitUntil("Said");
  yield* all(
    obsOutline().size(new Vector2(250, 250), 1),
    center().size(0, 1),
    obs().position([250, 0], 1),
    dozer.body().position([-250, 0], 1)
  );
  let text = createRef<Txt>();
  field().add(
    <Txt
      fill={MainColors.text}
      fontFamily={Fonts.main}
      fontSize={1.1 * fieldScale}
      position={new Vector2(0, 600)}
      ref={text}
      text="Minkowski Addition"
      zIndex={99999999}
    />
  );
  yield* waitUntil("Minkowski");
  yield* text().position(new Vector2(0, 300), 1);
  let circumcircle = createRef<Circle>();
  field().add(
    <Circle
      ref={circumcircle}
      size={258.38}
      position={[-250, -15]}
      end={0}
      stroke={MainColors.path}
      lineWidth={10}
    />
  );

  yield* waitUntil("Circumcircle");
  yield* all(text().position(new Vector2(0, 600), 1), circumcircle().end(1, 1));
  obsOutline().end(0);
  obsOutline().size([518.38, 518.38]);
  obsOutline().radius(150);
  yield* waitUntil("Moving");
  let unRotatedPos2 = obsOutline().getPointAtPercentage(0).position;
  // Need to rotate the position around the center of the circle
  let rotatedPos2 = unRotatedPos2.rotate(10, [0, 0]);
  rotatedPos2 = rotatedPos2.addX(250);
  yield chain(
    circumcircle().position(rotatedPos2, 1),
    tween(6, (tRaw) => {
      let t = easeInOutQuad(tRaw);
      if (t > 1) t -= 1;
      let unRotatedPos = obsOutline().getPointAtPercentage(t).position;
      // Need to rotate the position around the center of the circle
      let rotatedPos = unRotatedPos.rotate(10, [0, 0]);
      rotatedPos = rotatedPos.addX(250);
      circumcircle().position(rotatedPos);
      obsOutline().end(t);
    })
  );
  yield* waitUntil("center");
  let circleCenter = drawPoint(
    circumcircle(),
    new Vector2(0, 0),
    0,
    MainColors.path
  );
  circumcircle().zIndex(999999999999);
  yield* circleCenter().size(25, 0.75);
  yield* waitUntil("Overkill");
  yield* all(
    circumcircle().size(0, 1),
    circleCenter().size(0, 1),
    obs().position([0, 0], 1.5),
    obsOutline().position([0, 0], 1.5),
    dozer.animateOut(1)
  );
  dozer.body().remove();
  circumcircle().remove();

  let points = [];
  let lastUnrotatedPos = obsOutline().getPointAtPercentage(0).position;
  for (let i = 0; i < 100; i++) {
    let unRotatedPos = obsOutline().getPointAtPercentage(i / 100).position;
    if (
      unRotatedPos.x === lastUnrotatedPos.x ||
      unRotatedPos.y === lastUnrotatedPos.y
    )
      continue;
    lastUnrotatedPos = unRotatedPos;
    let rotatedPos = unRotatedPos.rotate(10, [0, 0]);
    points.push(drawPoint(field(), rotatedPos, 0, MainColors.path));
  }
  yield* waitUntil("vertices");
  yield* sequence(0.02, ...points.map((p) => p().size(15, 0.5)));
  yield* waitUntil("approximate");
  yield* sequence(
    0.01,
    chain(obsOutline().start(0.9999, 0.8)),
    ...points.map((p) => p().size(0, 0.4))
  );
  obsOutline().remove();
  yield* waitUntil("edge");

  let line = drawLine(
    field(),
    [new Vector2(-125, -125), new Vector2(125, -125)],
    10,
    MainColors.path
  );
  line().opacity(0).rotation(10);
  obs().zIndex(999999999999999);
  yield* sequence(
    0.4,
    all(
      obs().rotation(0, 0.7),
      line().rotation(0, 0.7),
      line().opacity(1, 0.7)
    ),
    all(camera().centerOn([0, -130], 0.7), camera().zoom(1.75, 0.7))
  );

  let normalVec = new VisualVector(100, -100, 10, 0);
  yield* waitUntil("vector");
  yield* normalVec.animateIn(
    field(),
    new Vector2(0, -125),
    MainColors.path.brighten(0.5)
  );
  yield* waitUntil("direction");
  yield* chain(
    all(normalVec.x(-200, 1), normalVec.y(-50, 1)),
    all(normalVec.x(100, 1), normalVec.y(-150, 1)),
    all(normalVec.x(0, 1.5), normalVec.y(-120, 1.5))
  );

  yield* waitUntil("perpendicular");
  let square = drawRect(
    field(),
    new Vector2(15, -140),
    30,
    30,
    new Color("#00000000"),
    5,
    2,
    MainColors.text
  );
  square().zIndex(-1).end(0);
  yield* all(square().end(0.5, 1));

  yield* waitUntil("slope");

  yield* waitFor(20);
});
