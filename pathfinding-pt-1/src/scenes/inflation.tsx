import {
  Camera,
  Circle,
  Grid,
  Latex,
  Layout,
  Txt,
  makeScene2D,
} from "@motion-canvas/2d";
import {
  Color,
  Direction,
  Vector2,
  all,
  chain,
  createRef,
  createSignal,
  easeInOutQuad,
  sequence,
  slideTransition,
  tween,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  Robot,
  VisualVector,
  drawCode,
  drawLine,
  drawPoint,
  drawRect,
} from "../utils";
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

  camera().scene().position(view.size().div(2));

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
  obs().zIndex(99999);
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
      text="Minkowski Sum"
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
  line().zIndex(99999999999);
  line().opacity(0).rotation(10);
  yield* sequence(
    0.4,
    all(
      obs().rotation(0, 1),
      obs().opacity(0.6, 1),
      line().rotation(0, 1),
      line().opacity(1, 1)
    ),
    all(camera().centerOn([0, -130], 1), camera().zoom(1.75, 1))
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
    all(normalVec.x(0, 1.5), normalVec.y(-fieldScale, 1.5))
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

  let measureLine1 = drawLine(
    field(),
    [
      new Vector2(-fieldScale, -fieldScale),
      new Vector2(fieldScale, -fieldScale),
    ],
    5,
    MainColors.backgroundLight
  );
  measureLine1().lineDash([30, 10]);
  measureLine1().end(0);
  let measureLine2 = drawLine(
    field(),
    [
      new Vector2(-fieldScale, -3 * fieldScale),
      new Vector2(-fieldScale, -fieldScale),
    ],
    5,
    MainColors.backgroundLight
  );
  measureLine2().lineDash([30, 10]);
  measureLine2().end(0);

  let measureX = createRef<Txt>();
  let xLayout = createRef<Layout>();
  let x = createSignal(0);
  field().add(
    <Layout
      ref={xLayout}
      layout
      direction="column"
      alignItems="center"
      gap={0}
      opacity={0}
    />
  );
  xLayout().add(
    <Txt
      ref={measureX}
      fontFamily={Fonts.main}
      fill={MainColors.text}
      text={() => `${x().toFixed(0)}`}
    />
  );
  xLayout().add(
    <Txt text="Run (x)" x={0} y={0} fill={MainColors.text} fontSize={20} />
  );

  let measureY = createRef<Txt>();

  let y = createSignal(0);
  let yLayout = createRef<Layout>();
  field().add(
    <Layout
      ref={yLayout}
      layout
      direction="column"
      alignItems="center"
      x={-2 * fieldScale}
      y={-2 * fieldScale}
      gap={0}
      opacity={0}
    />
  );
  yLayout().add(
    <Txt
      ref={measureY}
      fontFamily={Fonts.main}
      fill={MainColors.text}
      text={() => `${y().toFixed(0)}`}
    />
  );
  yLayout().add(
    <Txt text="Rise (y)" x={0} y={0} fill={MainColors.text} fontSize={20} />
  );

  let slopeTex = createRef<Latex>();
  field().add(
    <Latex
      ref={slopeTex}
      tex={() => `
      \\color{white}\\begin{align}&\\text{Slope} = \\frac{\\text{rise}}{\\text{run}} \\\\[0.6em]
      &\\text{Slope} = \\frac{${y().toFixed(2)}}{${x().toFixed(2)}} \\\\[0.6em]
      &\\text{Slope} = {${(y() / x()).toFixed(2)}}\\end{align}`}
      x={() => slopeTex().width() / 2 + 2.25 * fieldScale}
      y={-2.5 * fieldScale}
      height={2.25 * fieldScale}
      opacity={0}
    />
  );

  let xVecText = createSignal("run");
  let yVecText = createSignal("rise");

  let vecTex = createRef<Latex>();
  field().add(
    <Latex
      ref={vecTex}
      tex={() => `
      \\color{white}\\begin{align}&\\text{Vector} = (\\text{${xVecText()}}, \\text{${yVecText()}}) \\\\[0.6em]
      &\\text{Vector} = (${((normalVec.x() * 2) / fieldScale).toFixed(2)}, ${(
        (-normalVec.y() * 2) /
        fieldScale
      ).toFixed(2)})\\end{align}`}
      x={() => vecTex().width() / 2 + 2.25 * fieldScale}
      y={0}
      height={0.9 * fieldScale}
      opacity={0}
    />
  );

  yield* all(
    square().end(0, 0.8),
    obs().opacity(0, 0.8),
    line().points(
      [
        new Vector2(-fieldScale, -3 * fieldScale),
        new Vector2(fieldScale, -fieldScale),
      ],
      1.5
    ),
    normalVec.point().position(new Vector2(0, -2 * fieldScale), 1.5),
    normalVec.x(fieldScale, 1.5),
    normalVec.y(fieldScale, 1.5),
    normalVec.point().zIndex(999999999999, 1.5),
    normalVec.point().size(20, 1.5),
    measureLine1().end(1, 1.5),
    measureLine2().end(1, 1.5),
    xLayout().opacity(1, 1),
    yLayout().opacity(1, 1),
    x(2, 1.5),
    y(-2, 1.5),
    slopeTex().opacity(1, 1),
    vecTex().opacity(1, 1)
  );

  yield* waitUntil("invertX");

  yield* all(normalVec.x(-fieldScale, 0.5), xVecText("-run", 0.5));

  yield* waitUntil("invertY");

  yield* all(
    normalVec.y(-fieldScale, 0.5),
    normalVec.x(fieldScale, 0.5),
    xVecText("run", 0.5),
    yVecText("-rise", 0.5)
  );

  yield* waitUntil("otherSlopes");

  yield* all(
    line().points(
      [
        new Vector2(-2 * fieldScale, -2 * fieldScale),
        new Vector2(fieldScale, -fieldScale),
      ],
      1
    ),
    measureLine1().points(
      [
        new Vector2(-2 * fieldScale, -fieldScale),
        new Vector2(fieldScale, -fieldScale),
      ],
      1
    ),
    measureLine2().points(
      [
        new Vector2(-2 * fieldScale, -2 * fieldScale),
        new Vector2(-2 * fieldScale, -fieldScale),
      ],
      1
    ),
    yLayout().position(new Vector2(-3 * fieldScale, -1.5 * fieldScale), 1),
    xLayout().position(new Vector2(-0.5 * fieldScale, 0), 1),
    normalVec
      .point()
      .position(new Vector2(-0.5 * fieldScale, -1.5 * fieldScale), 1),
    x(3, 1),
    y(-1, 1),
    normalVec.x(1.5 * fieldScale, 1),
    normalVec.y(-0.5 * fieldScale, 1)
  );

  yield* waitUntil("switch");
  yield* all(
    xVecText("-rise", 1),
    yVecText("run", 1),
    normalVec.y(-1.5 * fieldScale, 1),
    normalVec.x(0.5 * fieldScale, 1)
  );

  yield* waitUntil("obstacle");

  obs()
    .size(new Vector2(4 * fieldScale, 4 * fieldScale))
    .zIndex(2);
  yield* all(
    xLayout().opacity(0, 1),
    yLayout().opacity(0, 1),
    measureLine1().end(0, 1),
    measureLine2().end(0, 1),
    slopeTex().opacity(0, 1),
    vecTex().opacity(0, 1),
    obs().opacity(0.6, 1),
    camera().centerOn([0, 0], 1),
    camera().zoom(1, 1),
    line().points(
      [
        new Vector2(-2 * fieldScale, -2 * fieldScale),
        new Vector2(2 * fieldScale, -2 * fieldScale),
      ],
      1
    ),
    normalVec.point().position(new Vector2(0, -2 * fieldScale), 1),
    normalVec.x(0, 1),
    normalVec.y(-1.5 * fieldScale, 1)
  );

  yield* waitUntil("inward");

  let rightLine = drawLine(
    field(),
    [
      new Vector2(2 * fieldScale, -2 * fieldScale),
      new Vector2(2 * fieldScale, 2 * fieldScale),
    ],
    10,
    MainColors.path
  );
  let leftLine = drawLine(
    field(),
    [
      new Vector2(-2 * fieldScale, -2 * fieldScale),
      new Vector2(-2 * fieldScale, 2 * fieldScale),
    ],
    10,
    MainColors.path
  );
  let bottomLine = drawLine(
    field(),
    [
      new Vector2(-2 * fieldScale, 2 * fieldScale),
      new Vector2(2 * fieldScale, 2 * fieldScale),
    ],
    10,
    MainColors.path
  );
  let lines = [rightLine, bottomLine, leftLine];
  lines.forEach((l) => l().end(0));

  let leftVec = new VisualVector(-1.5 * fieldScale, 0, 10, 20);
  let rightVec = new VisualVector(-1.5 * fieldScale, 0, 10, 20);
  let bottomVec = new VisualVector(0, -1.5 * fieldScale, 10, 20);

  let vecs = [leftVec, rightVec, bottomVec];
  let positions = [
    new Vector2(-2 * fieldScale, 0),
    new Vector2(2 * fieldScale, 0),
    new Vector2(0, 2 * fieldScale),
  ];
  yield* chain(
    all(...lines.map((l) => l().end(1, 0.75))),
    all(
      ...vecs.map((v, i) =>
        v.animateIn(field(), positions[i], MainColors.path.brighten(0.5), 0.75)
      )
    )
  );

  yield* waitUntil("dotProduct");
  let dotProductText = createRef<Txt>();
  field().add(
    <Txt
      ref={dotProductText}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      fontSize={1.1 * fieldScale}
      position={new Vector2(4 * fieldScale, -600)}
      text="Dot Product"
      zIndex={99999999}
    />
  );
  let dotProductTex = createRef<Latex>();
  field().add(
    <Latex
      ref={dotProductTex}
      tex={`\\color{white}\\vec{a} \\cdot \\vec{b} = a_x \\cdot b_x + a_y \\cdot b_y\\`}
      x={() => dotProductTex().width() / 2 + 0.75 * fieldScale}
      y={600}
      height={1 * fieldScale}
    />
  );
  let dotProduct = drawCode(
    field(),
    new Vector2(4 * fieldScale, 750),
    `class Vector {
  /* ... */
  public double dotProduct(Vector other) {
    return
  }
}`,
    "java",
    34
  );
  yield* all(
    ...[line, normalVec.point, obs, ...lines, ...vecs.map((v) => v.point)].map(
      (v) => v().position([v().position().x - 450, v().position().y], 1)
    ),
    dotProductText().position(new Vector2(4 * fieldScale, -230), 1),
    dotProduct.codeBackground().y(30, 1)
  );

  yield* waitUntil("x");
  yield* dotProduct.codeBlock().code(
    `class Vector {
  /* ... */
  public double dotProduct(Vector other) {
    return x * other.x
  }
}`,
    1
  );
  yield* waitUntil("y");
  yield* dotProduct.codeBlock().code(
    `class Vector {
  /* ... */
  public double dotProduct(Vector other) {
    return x * other.x + y * other.y;
  }
}`,
    1
  );
  yield* waitFor(1);
  yield* all(
    dotProductText().y(-300, 1),
    dotProduct.codeBackground().y(0, 1),
    dotProductTex().y(300, 1)
  );
  yield* waitFor(20);
});
