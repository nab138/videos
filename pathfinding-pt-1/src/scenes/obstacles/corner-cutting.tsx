import {
  Camera,
  Circle,
  Grid,
  Img,
  Line,
  makeScene2D,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  chain,
  createRef,
  createRefMap,
  Direction,
  easeInCubic,
  easeOutCubic,
  sequence,
  slideTransition,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Fonts, MainColors } from "../../styles";
import Overview from "../../../resources/overview.png";
import { drawPoint, Robot } from "../../utils";

export default makeScene2D(function* (view) {
  let fieldScale = 90;
  let inflationDist = 258.38;
  let camera = createRef<Camera>();
  let text = createRefMap<Txt>();

  view.add(<Camera ref={camera}></Camera>);

  camera().scene().position(view.size().div(2));

  yield* slideTransition(Direction.Bottom, 1);
  let overview = createRef<Img>();
  view.add(
    <Img
      ref={overview}
      src={Overview}
      width={view.width() / 2}
      height={view.height() / 2}
      opacity={0}
    />
  );
  yield* all(
    overview().width(view.width(), 0.75),
    overview().height(view.height(), 0.75),
    overview().opacity(1, 0.75)
  );
  yield* waitUntil("step 1");
  let stepOneOutline = createRef<Circle>();
  overview().add(
    <Circle
      ref={stepOneOutline}
      size={225}
      stroke={MainColors.path}
      lineWidth={10}
      x={-562.5}
      y={-50}
      end={0}
    />
  );
  yield* stepOneOutline().end(1, 1);

  yield* waitUntil("square");
  let square = createRef<Rect>();
  let squareInflated = createRef<Rect>();
  view.add(
    <Rect
      ref={square}
      fill={MainColors.obstacles}
      radius={15}
      stroke={MainColors.border}
      lineWidth={2}
    />
  );
  square().add(
    <Rect
      ref={squareInflated}
      radius={2}
      stroke={MainColors.path}
      lineWidth={10}
    />
  );
  yield* sequence(
    0.5,
    all(
      overview().x(-view.width() * 1, 1),
      stepOneOutline().end(0, 0.75),
      overview().opacity(0, 1)
    ),
    all(
      square().width(4 * fieldScale, 0.75),
      square().height(4 * fieldScale, 0.75)
    ),
    all(
      squareInflated().width(4 * fieldScale + inflationDist, 0.75),
      squareInflated().height(4 * fieldScale + inflationDist, 0.75)
    )
  );
  let rightAngle = createRef<Rect>();
  square().add(
    <Rect
      ref={rightAngle}
      width={80}
      height={80}
      stroke={MainColors.text}
      lineWidth={10}
      end={0}
      zIndex={-1}
      x={-squareInflated().width() / 2 + 40}
      y={squareInflated().height() / 2 - 40}
      lineDash={[25, 10]}
    />
  );
  square().add(
    <Txt
      ref={text.squareAngleTxt}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      fontSize={80}
      y={squareInflated().height() / 2 + 90}
    />
  );
  square().add(
    <Txt
      ref={text.worksFor}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      fontSize={80}
      y={-squareInflated().height() / 2 - 90}
    />
  );
  square().add;
  yield* waitUntil("Right");
  yield* sequence(
    0.25,
    text.worksFor().text("Good enough", 1),
    text.squareAngleTxt().text("≥ 90°", 1),
    rightAngle().end(0.5, 0.75)
  );
  yield* waitUntil("however");
  let divider = createRef<Rect>();
  view.add(
    <Line
      ref={divider}
      points={[
        [0, -view.height() / 2],
        [0, view.height() / 2],
      ]}
      lineWidth={10}
      stroke={MainColors.text}
      end={0}
    />
  );
  yield* sequence(0.5, square().x(-view.width() / 4, 1), divider().end(1, 1));
  yield* waitUntil("triangle");

  let triPoints = [
    new Vector2(0, 0),
    new Vector2(0, 3 * fieldScale),
    new Vector2(-5 * fieldScale, 3 * fieldScale),
  ];
  let triangle = createRef<Line>();
  let triangleInflated = createRef<Line>();
  view.add(
    <Line
      ref={triangle}
      stroke={MainColors.obstacles}
      lineWidth={5}
      points={triPoints}
      closed
      radius={10}
      end={0}
      x={view.width() / 4 + 3.4 * fieldScale}
      y={-1.5 * fieldScale * 0.8}
      scale={0.8}
    />
  );
  let inflatedTriPoints = [
    new Vector2(1.435444444 * fieldScale, -2.53526816656 * fieldScale),
    new Vector2(1.435444444 * fieldScale, 4.435444443999999 * fieldScale),
    new Vector2(
      -10.182409906933334 * fieldScale,
      4.435444443999999 * fieldScale
    ),
  ];
  triangle().add(
    <Line
      ref={triangleInflated}
      stroke={MainColors.path}
      lineWidth={10}
      points={inflatedTriPoints}
      closed
      radius={2}
      end={0}
    />
  );
  view.add(
    <Txt
      ref={text.triangleAngleTxt}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      fontSize={80}
      x={view.width() / 4}
      y={squareInflated().height() / 2 + 90}
    />
  );
  view.add(
    <Txt
      ref={text.noWorksFor}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      fontSize={80}
      x={view.width() / 4}
      y={-squareInflated().height() / 2 - 90}
    />
  );
  let angleCircle = createRef<Circle>();
  triangle().add(
    <Circle
      zIndex={-1}
      ref={angleCircle}
      size={250 / 0.8}
      stroke={MainColors.text}
      lineWidth={8 / 0.8}
      start={0.91}
      end={0.91}
      x={-10.182409906933334 * fieldScale}
      y={4.435444443999999 * fieldScale}
      lineDash={[25 / 0.8, 10 / 0.8]}
    />
  );

  yield* sequence(
    1.5,
    chain(triangle().end(1, 1), triangle().fill(MainColors.obstacles, 1)),
    sequence(
      0.25,
      all(triangle().lineWidth(2, 1), triangle().stroke(MainColors.border, 1)),
      chain(triangleInflated().end(1, 1), angleCircle().end(1, 1)),
      text.triangleAngleTxt().text("< 90°", 1),
      text.noWorksFor().text("Not good enough", 1)
    )
  );
  yield* waitUntil("robot");
  let robot = Robot.dozer(
    view,
    new Vector2(3.25 * fieldScale, -2 * fieldScale),
    fieldScale * 1.75
  );
  let ghostRobot = Robot.dozer(
    view,
    new Vector2(3.25 * fieldScale, -2 * fieldScale),
    fieldScale * 1.75
  );
  ghostRobot.body().opacity(0.6);
  robot.body().zIndex(9999);
  robot.body().rotation(180);
  ghostRobot.body().rotation(180);
  let circumcircle = createRef<Circle>();
  robot
    .body()
    .add(
      <Circle
        ref={circumcircle}
        size={258.38}
        position={[0, 0]}
        end={0}
        stroke={MainColors.obstacles}
        lineWidth={10}
      />
    );

  let circleCenter = drawPoint(
    circumcircle(),
    new Vector2(0, 0),
    0,
    MainColors.obstacles
  );

  yield* chain(
    all(ghostRobot.animateIn(1), robot.animateIn(1)),
    all(circumcircle().end(1, 0.6), circleCenter().size(25, 0.6))
  );
  yield* waitUntil("drive");
  yield* all(
    robot.body().y(0.55 * fieldScale, 1, easeInCubic),
    chain(
      ghostRobot.body().y(0.55 * fieldScale, 1, easeInCubic),
      ghostRobot.body().y(3 * fieldScale, 1, easeOutCubic)
    )
  );
  yield* waitUntil("minkow");
  yield* all(
    chain(
      ghostRobot.body().y(0.55 * fieldScale, 0.5),
      all(
        ghostRobot.animateOut(1),
        robot.animateOut(1),
        circumcircle().end(0, 1),
        circleCenter().size(0, 1),
        angleCircle().end(0.91, 0.5),
        rightAngle().end(0, 0.5)
      ),
      all(
        triangleInflated().radius(125, 1),
        squareInflated().radius(125, 1),
        triangle().x(view.width() / 4 + 2 * fieldScale, 1),
        text.noWorksFor().text("Good enough", 1)
      )
    )
  );
  yield* waitUntil("different");
  yield* all(
    square().x(-view.width(), 1),
    divider().end(0, 1),
    triangle().x(view.width(), 1),
    text.triangleAngleTxt().x(view.width(), 1),
    text.noWorksFor().x(view.width(), 1)
  );
  yield* waitUntil("cornercutting");
  view.add(
    <Txt
      text={"Corner Cutting"}
      ref={text.cornerCutting}
      fontSize={50}
      y={600}
      fill={MainColors.text}
      fontFamily={Fonts.main}
    />
  );
  yield* all(
    text.cornerCutting().y(0, 1),
    text.cornerCutting().fontSize(120, 1)
  );
  yield* waitUntil("before");
  yield* all(
    text.cornerCutting().fontSize(80, 1),
    text.cornerCutting().y(-425, 1)
  );
  let obs = createRef<Rect>();
  view.add(
    <Rect
      ref={obs}
      fill={MainColors.obstacles}
      radius={15}
      stroke={MainColors.border}
      lineWidth={2}
    />
  );
  yield* all(
    obs().width(4 * fieldScale, 0.75),
    obs().height(4 * fieldScale, 0.75)
  );

  yield* waitFor(10);
});
