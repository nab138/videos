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
  Direction,
  sequence,
  slideTransition,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Fonts, MainColors } from "../../styles";
import Overview from "../../../resources/overview.png";

export default makeScene2D(function* (view) {
  let fieldScale = 90;
  let inflationDist = 258.38;
  let camera = createRef<Camera>();

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
    />
  );
  let worksFor = createRef<Txt>();
  let squareAngleTxt = createRef<Txt>();
  square().add(
    <Txt
      ref={squareAngleTxt}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      fontSize={80}
      y={squareInflated().height() / 2 + 90}
    />
  );
  square().add(
    <Txt
      ref={worksFor}
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
    worksFor().text("Works for", 1),
    squareAngleTxt().text("≥ 90°", 1),
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
    new Vector2(5 * fieldScale, 3 * fieldScale),
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
      x={view.width() / 4 - 2.5 * fieldScale}
      y={-1.5 * fieldScale}
    />
  );
  yield* sequence(
    1.5,
    chain(triangle().end(1, 1), triangle().fill(MainColors.obstacles, 1)),
    all(triangle().lineWidth(2, 1), triangle().stroke(MainColors.border, 1))
  );
  yield* waitFor(10);
});
