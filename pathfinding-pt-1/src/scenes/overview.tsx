import { Circle, Img, Layout, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import {
  Direction,
  Vector2,
  all,
  createRef,
  delay,
  easeOutCubic,
  sequence,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import trafficCone from "../../resources/traffic-cone.svg";

import { drawLine, drawLines, drawPoints, drawRect } from "../utils";
import { Fonts, MainColors } from "../styles";

export default makeScene2D(function* (view) {
  yield* slideTransition(Direction.Right, 1);
  yield* waitUntil("overviewStart");

  let layouts = [];
  let rect = drawRect(
    view,
    new Vector2(0, 0),
    0,
    0,
    MainColors.interactionArea,
    0,
    20
  );

  let text = createRef<Txt>();
  view.add(
    <Txt
      fill={MainColors.text}
      fontFamily={Fonts.main}
      fontSize={100}
      position={new Vector2(0, -600)}
      ref={text}
      text="Pathing Steps"
      zIndex={99999999}
    />
  );
  yield* sequence(
    0.2,
    rect().width(1500, 1),
    rect().height(400, 1),
    text().y(-300, 1)
  );

  yield* waitFor(3.5);

  let curCircle = createRef<Circle>();
  let curText = createRef<Txt>();
  let curLayout = createRef<Layout>();

  let obstaclesImage = createRef<Img>();

  rect().add(
    <Layout
      ref={curLayout}
      layout
      direction="column"
      alignItems="center"
      y={0}
      gap={40}
    >
      ,
      <Circle
        ref={curCircle}
        layout
        size={0}
        fill={MainColors.backgroundLight}
        justifyContent="center"
        alignItems="center"
      >
        <Img
          ref={obstaclesImage}
          src={trafficCone}
          width={0}
          height={0}
          marginBottom={10}
        />
      </Circle>
      <Txt
        ref={curText}
        opacity={0}
        fill={MainColors.text}
        fontFamily={Fonts.main}
      >
        Obstacles
      </Txt>
    </Layout>
  );

  yield* sequence(
    0.5,
    curCircle().size(225, 1),
    all(obstaclesImage().width(150, 1), obstaclesImage().height(150, 1)),
    curText().opacity(1, 1)
  );
  yield* waitFor(3);
  yield* curLayout().x(-610, 0.8);
  layouts.push(curLayout());

  rect().add(
    <Layout
      ref={curLayout}
      width={0}
      layout
      direction="column"
      alignItems="center"
      y={0}
      gap={40}
    >
      <Circle
        ref={curCircle}
        size={0}
        fill={MainColors.backgroundLight}
      ></Circle>
      <Txt
        ref={curText}
        opacity={0}
        fill={MainColors.text}
        fontFamily={Fonts.main}
      >
        Visibility Graph
      </Txt>
    </Layout>
  );

  yield* curCircle().size(225, 1);

  let points = [
    new Vector2(-55, 51),
    new Vector2(50, -45),
    new Vector2(48, 51),
    new Vector2(-50, -45),
  ];
  let circles = drawPoints(curCircle(), points, 0, MainColors.obstacles);

  let lines1 = [
    new Vector2(-55, 51),
    new Vector2(50, -45),
    new Vector2(-55, 51),
    new Vector2(48, 51),
    new Vector2(-55, 51),
    new Vector2(-50, -45),
  ];

  let lines = drawLines(curCircle(), lines1, 5, MainColors.obstacles);

  for (let line of lines) {
    line().endOffset(line().percentageToDistance(1));
  }

  yield* sequence(
    1.25,
    sequence(0.1, ...circles.map((c) => c().size(8, 0.5))),
    sequence(0.1, ...lines.map((c) => c().endOffset(0, 0.5))),
    delay(0.7, curText().opacity(1, 1))
  );

  yield* waitFor(0.3);

  yield* curLayout().x(-280, 0.8);
  layouts.push(curLayout());

  rect().add(
    <Layout
      ref={curLayout}
      width={0}
      layout
      direction="column"
      alignItems="center"
      gap={40}
      x={70}
    >
      <Circle
        ref={curCircle}
        size={0}
        fill={MainColors.backgroundLight}
      ></Circle>
      <Txt
        ref={curText}
        opacity={0}
        fill={MainColors.text}
        fontFamily={Fonts.main}
      >
        Pathfinding
      </Txt>
    </Layout>
  );

  yield* sequence(1.6, curCircle().size(225, 1), curText().opacity(1, 1));

  let points2 = [
    new Vector2(48, 51),
    new Vector2(-55, 51),
    new Vector2(-50, -45),
    new Vector2(50, -45),
  ];
  let circles2 = drawPoints(
    curCircle(),
    points2,
    0,
    MainColors.interactionArea
  );
  let obs = drawRect(
    curCircle(),
    new Vector2(20, 0),
    0,
    0,
    MainColors.obstacles
  );
  yield* sequence(
    0.1,
    ...circles2.map((c) => c().size(8, 0.5)),
    all(obs().width(90, 0.5), obs().height(25, 0.5))
  );

  let line = drawLine(curCircle(), points2, 5, MainColors.path);

  line().endOffset(line().percentageToDistance(1));

  yield* line().endOffset(0, 1.2);

  yield* waitFor(1.5);

  //yield* curLayout().x(187.5, 0.8);
  layouts.push(curLayout());

  rect().add(
    <Layout
      ref={curLayout}
      width={0}
      layout
      direction="column"
      alignItems="center"
      gap={40}
      x={380}
      y={0}
    >
      <Circle
        ref={curCircle}
        size={0}
        fill={MainColors.backgroundLight}
      ></Circle>
      <Txt
        ref={curText}
        opacity={0}
        fill={MainColors.text}
        fontFamily={Fonts.main}
      >
        Smoothing
      </Txt>
    </Layout>
  );

  yield* sequence(1.75, curCircle().size(225, 1), curText().opacity(1, 1));

  let points3 = [
    new Vector2(48, 51),
    new Vector2(-55, 51),
    new Vector2(-50, -45),
    new Vector2(50, -45),
  ];
  let circles3 = drawPoints(
    curCircle(),
    points3,
    0,
    MainColors.interactionArea
  );
  let obs2 = drawRect(
    curCircle(),
    new Vector2(20, 0),
    0,
    0,
    MainColors.obstacles
  );
  yield* sequence(
    0.1,
    ...circles3.map((c) => c().size(8, 0.25)),
    all(obs2().width(90, 0.5), obs2().height(25, 0.25))
  );

  let line2 = drawLine(curCircle(), points2, 5, MainColors.path);

  line2().endOffset(line2().percentageToDistance(1));

  yield* line2().endOffset(0, 0.5);

  yield* waitFor(0.4);

  layouts.push(curLayout());

  let positions = [-562.5, -187.5, 187.5, 562.5];
  let generators = [];
  for (let layout in layouts) {
    generators.push(layouts[layout].x(positions[layout], 0.8));
  }

  yield* sequence(1, line2().radius(35, 1.5, easeOutCubic), all(...generators));

  yield* waitFor(0.2);

  let arrows = [
    new Vector2(-430, -45),
    new Vector2(-320, -45),
    new Vector2(-50, -45),
    new Vector2(60, -45),
    new Vector2(325, -45),
    new Vector2(435, -45),
  ];

  let arrow = drawLines(rect(), arrows, 5, MainColors.text, false, true);
  for (let curArrow of arrow) {
    curArrow().endOffset(curArrow().percentageToDistance(1));
  }
  yield* sequence(0.15, ...arrow.map((c) => c().endOffset(0, 0.6)));

  yield* waitUntil("transitionToObstacles");
});
