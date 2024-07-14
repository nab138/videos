import {
  Camera,
  Circle,
  CubicBezier,
  Grid,
  Latex,
  Layout,
  Txt,
  makeScene2D,
} from "@motion-canvas/2d";
import {
  Color,
  Direction,
  PossibleVector2,
  Vector2,
  all,
  chain,
  createRef,
  createSignal,
  easeInCubic,
  easeInOutCubic,
  easeInOutQuad,
  easeOutCubic,
  linear,
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
} from "../../utils";
import { Fonts, MainColors } from "../../styles";

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
  yield obsOutline().lineWidth(0, 1.5);
  yield* all(
    obsOutline().size(new Vector2(250, 250), 1),
    center().size(0, 1),
    obs().position([250, 0], 1),

    dozer.body().position([-250, 0], 1)
  );
  yield obsOutline().lineWidth(0, 0.5);
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
      width={200}
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
      \\color{white}\\begin{align}&\\vec{v} = \\langle\\text{${xVecText()}}, \\text{${yVecText()}} \\rangle	\\\\[0.6em]
      &\\vec{v} = \\langle${((normalVec.x() * 2) / fieldScale).toFixed(2)}, ${(
        (-normalVec.y() * 2) /
        fieldScale
      ).toFixed(2)}\\rangle	\\end{align}`}
      x={() => vecTex().width() / 2 + 2.25 * fieldScale}
      y={0}
      height={100}
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
      new Vector2(2 * fieldScale, -2 * fieldScale - 5),
      new Vector2(2 * fieldScale, 2 * fieldScale),
    ],
    10,
    MainColors.path
  );
  let leftLine = drawLine(
    field(),
    [
      new Vector2(-2 * fieldScale, -2 * fieldScale - 5),
      new Vector2(-2 * fieldScale, 2 * fieldScale),
    ],
    10,
    MainColors.path
  );
  let bottomLine = drawLine(
    field(),
    [
      new Vector2(-2 * fieldScale - 5, 2 * fieldScale),
      new Vector2(2 * fieldScale + 5, 2 * fieldScale),
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
  obs().zIndex(0);
  yield* chain(
    all(...lines.map((l) => l().end(1, 0.75))),
    all(
      ...vecs.map((v, i) =>
        v.animateIn(
          field(),
          positions[i],
          MainColors.path.brighten(0.5),
          0.75,
          easeInOutCubic,
          999
        )
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
      tex={`\\color{white}\\begin{align}\\color{white}&\\vec{a} \\cdot \\vec{b} = a_x \\cdot b_x + a_y \\cdot b_y\\end{align}`}
      x={() => 4 * fieldScale}
      y={600}
      height={100}
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
      (v) => v().x(v().x() - 450, 1)
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
  let dotX1 = createSignal(2);
  let dotY1 = createSignal(-2);
  let rotationAngle = createSignal(Math.PI / 4); // New signal for the rotation angle

  let dotX2Raw = createSignal(() => -Math.cos(rotationAngle()));
  let dotY2Raw = createSignal(() => Math.sin(rotationAngle()));
  let mag = createSignal(() => Math.sqrt(dotX2Raw() ** 2 + dotY2Raw() ** 2));
  let dotX2 = createSignal(() => (dotX2Raw() / mag()) * 2.12132034356);
  let dotY2 = createSignal(() => (dotY2Raw() / mag()) * 2.12132034356);
  let dotProductSolutionTex = createRef<Latex>();
  let dotVec1 = VisualVector.fromSignals(
    createSignal(() => dotX1() * fieldScale),
    createSignal(() => -dotY1() * fieldScale),
    15,
    30
  );
  let dotVec2 = VisualVector.fromSignals(
    createSignal(() => dotX2() * fieldScale),
    createSignal(() => -dotY2() * fieldScale),
    15,
    30
  );

  let lRed = MainColors.path.brighten(0.5).hex();
  let lBlue = MainColors.blue.brighten(0.5).hex();
  field().add(
    <Latex
      ref={dotProductSolutionTex}
      tex={() => `
      \\color{${lRed}}\\begin{align}&\\vec{a} \\color{white}\\cdot \\color{${lBlue}}\\vec{b}  \\color{white}\\,\\approx\\, \\color{${lRed}}${dotX1().toFixed(
        2
      )}  \\color{white}\\cdot \\color{${lBlue}}${dotX2().toFixed(
        2
      )}  \\color{white}+ \\color{${lRed}}${dotY1().toFixed(
        2
      )} \\color{white}\\cdot \\color{${lBlue}}${dotY2().toFixed(2)} \\\\[0.6em]
      &\\color{${lRed}}\\vec{a}  \\color{white}\\cdot \\color{${lBlue}}\\vec{b}  \\color{white}\\,\\approx\\, ${(
        dotX1() * dotX2() +
        dotY1() * dotY2()
      ).toFixed(2)}\\end{align}`}
      x={() => dotProductSolutionTex().width() / 2 - 100}
      height={240}
      y={650}
    />
  );
  yield* waitUntil("unique");
  yield* all(
    dotProduct.codeBackground().x(1400, 1),
    ...[line, normalVec.point, obs, ...lines, ...vecs.map((v) => v.point)].map(
      (v) => v().x(v().x() - 800, 1)
    ),
    dotProductTex().y(-100, 1),
    dotProductTex().x(240, 1),
    dotProductSolutionTex().y(100, 1),
    dotVec1.animateIn(
      field(),
      new Vector2(-fieldScale * 6, 0),
      MainColors.path.brighten(0.5),
      1
    ),
    dotVec2.animateIn(
      field(),
      new Vector2(-fieldScale * 6, 0),
      MainColors.blue.brighten(0.5),
      1
    )
  );
  yield* waitUntil("more");

  yield* chain(
    rotationAngle((2 * Math.PI) / 3, 1),
    rotationAngle((-1 * Math.PI) / 5, 1)
  );

  yield* waitUntil("less");

  yield* chain(
    rotationAngle(-2 * Math.PI + (4 * Math.PI) / 5, 1.5),
    rotationAngle((-2 * Math.PI) / 5, 1.5)
  );

  yield* waitUntil("normal");

  yield* sequence(
    0.3,
    all(
      dotVec1.animateOut(1),
      dotVec2.animateOut(1),
      dotProductTex().y(600, 1),
      dotProductSolutionTex().y(650, 1),
      dotProductText().y(-600, 1)
    ),
    all(
      ...[
        line,
        normalVec.point,
        obs,
        ...lines,
        ...vecs.map((v) => v.point),
      ].map((v) => v().x(v().x() + 1250, 1.5))
    )
  );

  let centerVecs = [];
  for (let i = 0; i < 4; i++) {
    centerVecs.push(new VisualVector(0, 0, 10, 25));
  }
  yield* waitUntil("centa");
  let edgePositions = [new Vector2(0, -2 * fieldScale), ...positions];
  let cornerPositions = [
    new Vector2(-2 * fieldScale, -2 * fieldScale),
    new Vector2(2 * fieldScale, -2 * fieldScale),
    new Vector2(2 * fieldScale, 2 * fieldScale),
    new Vector2(-2 * fieldScale, 2 * fieldScale),
  ];
  line().zIndex(997);
  yield* chain(
    all(
      ...centerVecs.map((c, i) =>
        c.animateIn(
          field(),
          cornerPositions[i],
          MainColors.blue.brighten(0.5),
          1,
          easeInOutCubic,
          998
        )
      )
    ),
    all(...centerVecs.map((c) => c.point().position([0, 0], 1, easeInOutCubic)))
  );

  yield* waitUntil("vertex");
  yield* centerVecs.map((c, i) =>
    all(c.x(edgePositions[i].x, 1), c.y(edgePositions[i].y, 1))
  );
  yield* waitUntil("dot");
  let dotTexts = [];
  for (let i = 0; i < 4; i++) {
    let ref = createRef<Txt>();
    let horizontal = i == 0 || i == 3;
    let corVec = i === 0 ? normalVec : vecs[i - 1];
    field().add(
      <Txt
        ref={ref}
        fill={MainColors.text}
        fontFamily={Fonts.main}
        fontSize={0.5 * fieldScale}
        position={edgePositions[i]
          .mul(horizontal ? 1.35 : 1.75)
          .add(horizontal ? [135, 0] : [0, 70])}
        text={() =>
          "Dot = " +
          (
            (edgePositions[i].x / fieldScale) * (corVec.x() / fieldScale) +
            (edgePositions[i].y / fieldScale) * (corVec.y() / fieldScale)
          ).toFixed(1)
        }
        opacity={0}
      />
    );
    dotTexts.push(ref);
  }

  yield* chain(
    all(...centerVecs.map((c, i) => c.point().position(edgePositions[i], 1))),
    all(...dotTexts.map((d) => d().opacity(1, 1)))
  );

  yield* waitUntil("flip");

  yield* all(vecs[2].y(1.5 * fieldScale, 1), vecs[1].x(1.5 * fieldScale, 1));

  // TODO: Normalize
  yield* waitUntil("normalize");
  yield* all(
    ...[normalVec, ...vecs].map((v) => {
      let mag = Math.sqrt(v.x() ** 2 + v.y() ** 2);
      return all(
        v.x((v.x() / mag) * fieldScale, 1),
        v.y((v.y() / mag) * fieldScale, 1)
      );
    })
  );
  yield* waitUntil("vecsDissapear");
  yield* all(
    ...centerVecs.map((c) => c.animateOut(1)),
    ...dotTexts.map((d) => d().opacity(0, 1))
  );
  yield* waitUntil("scale");
  yield* all(
    ...[normalVec, ...vecs].map((v) => {
      let mag = Math.sqrt(v.x() ** 2 + v.y() ** 2);
      return all(
        v.x((v.x() / mag) * fieldScale * 1.75, 1),
        v.y((v.y() / mag) * fieldScale * 1.75, 1)
      );
    })
  );
  yield* all(
    ...[normalVec, ...vecs].map((v) => {
      let mag = Math.sqrt(v.x() ** 2 + v.y() ** 2);
      return all(
        v.x((v.x() / mag) * fieldScale * 0.75, 1),
        v.y((v.y() / mag) * fieldScale * 0.75, 1)
      );
    })
  );
  yield* waitUntil("robot");
  dozer.body().position([-7 * fieldScale, 0]);
  circumcircle()
    .size(258.38)
    .end(0)
    .position([-7 * fieldScale, -15]);
  let radius = drawLine(
    field(),
    [
      new Vector2(-7 * fieldScale, -15),
      new Vector2(-7 * fieldScale, -15 - 258.38 / 2),
    ],
    10,
    MainColors.obstacles.brighten(0.75)
  );
  radius().end(0).zIndex(999999999999);
  yield* sequence(
    0.25,
    dozer.animateIn(1),
    circumcircle().end(1, 1),
    radius().end(1, 1)
  );
  yield* waitUntil("scaleByRadius");
  yield* sequence(
    0.5,
    radius().points(
      [
        [0, -2 * fieldScale],
        [0, -2 * fieldScale - 258.38 / 2],
      ],
      1
    ),
    all(
      ...[normalVec, ...vecs].map((v) => {
        let mag = Math.sqrt(v.x() ** 2 + v.y() ** 2);
        return all(
          v.x((v.x() / mag) * (258.38 / 2), 1),
          v.y((v.y() / mag) * (258.38 / 2), 1)
        );
      })
    )
  );
  yield* waitUntil("robotDismiss");
  yield* all(dozer.animateOut(1), circumcircle().end(0, 1), radius().end(0, 1));
  dozer.body().remove();
  circumcircle().remove();
  radius().remove();
  yield* waitUntil("translate");
  yield* line().position([0, -258.38 / 2], 1);
  yield* waitUntil("allTranslate");
  yield* all(
    ...lines.map((e, i) => {
      let horiz = i === 1;
      let negative = horiz
        ? e().getPointAtPercentage(0).position.y < 0
        : e().getPointAtPercentage(0).position.x < 0;
      let sign = negative ? -1 : 1;
      let pos = (
        horiz ? [0, sign * (258.38 / 2)] : [sign * (258.38 / 2), 0]
      ) as PossibleVector2;
      return e().position(pos, 1);
    })
  );

  yield* waitUntil("extend");
  yield* sequence(
    0.25,
    all(...[normalVec, ...vecs].map((v) => v.animateOut(1))),
    all(
      ...[line, ...lines].map((e) => {
        let p1 = e().getPointAtPercentage(0).position;
        let p2 = e().getPointAtPercentage(1).position;
        let horz = p1.y === p2.y;
        if (horz) {
          return e().points([p1.addX(-800), p2.addX(800)], 1);
        } else {
          return e().points([p1.addY(-360), p2.addY(360)], 1);
        }
      })
    )
  );
  yield* waitUntil("cutOff");
  let corners = [];
  for (let i = 0; i < 4; i++) {
    corners.push(
      drawPoint(
        field(),
        cornerPositions[i].normalized.mul(2 * fieldScale + 258.38),
        0,
        MainColors.blue
      )
    );
    corners[i]().zIndex(999999999999);
  }
  yield* sequence(
    0.5,
    all(
      ...[line, ...lines].map((e) => {
        let p1 = e().getPointAtPercentage(0).position;
        let p2 = e().getPointAtPercentage(1).position;
        let horz = p1.y === p2.y;
        if (horz) {
          return e().points(
            [p1.addX(800 - 258.38 / 2), p2.addX(-800 + 258.38 / 2)],
            1
          );
        } else {
          return e().points(
            [p1.addY(360 - 258.38 / 2), p2.addY(-360 + 258.38 / 2)],
            1
          );
        }
      })
    ),
    all(...corners.map((c) => c().size(25, 0.5)))
  );
  yield* waitUntil("twoLines");
});
