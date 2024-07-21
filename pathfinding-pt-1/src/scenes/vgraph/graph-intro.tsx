import { Circle, Img, Line, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
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

import Overview from "../../../resources/overview.png";
import { Fonts, MainColors } from "../../styles";
import { DefinitionFeature } from "../../components/DefinitionFeature";
import { drawPoint } from "../../utils";

export default makeScene2D(function* (view) {
  yield* slideTransition(Direction.Right, 1);
  const fieldScale = 90;

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
  yield* waitUntil("Overview");
  yield* all(
    overview().width(view.width(), 0.75),
    overview().height(view.height(), 0.75),
    overview().opacity(1, 0.75)
  );
  yield* waitUntil("SecondStep");
  let stepTwoOutline = createRef<Circle>();
  overview().add(
    <Circle
      ref={stepTwoOutline}
      size={225}
      stroke={MainColors.path}
      lineWidth={10}
      x={-187.5}
      y={-50}
      end={0}
    />
  );
  yield* stepTwoOutline().end(1, 1);
  yield* waitUntil("overviewDismiss");
  yield* all(
    overview().x(-view.width() * 1, 1),
    stepTwoOutline().end(0, 0.75),
    overview().opacity(0, 1)
  );
  yield* waitUntil("visibilityGraph");
  let visibilityGraphTxt = createRef<Txt>();
  view.add(
    <Txt
      text={"Visibility Graph"}
      ref={visibilityGraphTxt}
      fontSize={50}
      y={600}
      fill={MainColors.text}
      fontFamily={Fonts.main}
    />
  );
  yield* all(
    visibilityGraphTxt().y(0, 1),
    visibilityGraphTxt().fontSize(120, 1)
  );
  yield* waitUntil("graph");
  yield all(
    visibilityGraphTxt().fontSize(80, 1),
    visibilityGraphTxt().y(-425, 1)
  );

  let graphDefinition = createRef<DefinitionFeature>();
  view.add(
    <DefinitionFeature
      ref={graphDefinition}
      word={"Graph"}
      definition={"A set of vertices and edges that connect them."}
      featureWidth={view.height() / 1.5}
      width={view.width()}
      height={view.height()}
      featureY={1000}
      pads={25}
    />
  );
  yield* graphDefinition().slideInVertical(1);
  yield* waitUntil("graphDismiss");
  yield* graphDefinition().slideOutVertical(1000, 1);

  yield* waitUntil("obstacles");
  yield* visibilityGraphTxt().text("Graph", 1);
  let squareVertices = [
    new Vector2(-3 * fieldScale, -3 * fieldScale),
    new Vector2(3 * fieldScale, -3 * fieldScale),
    new Vector2(3 * fieldScale, 3 * fieldScale),
    new Vector2(-3 * fieldScale, 3 * fieldScale),
  ];
  let squarePoints = squareVertices.map((v) => {
    let p = drawPoint(view, v, 0, MainColors.path);
    p().zIndex(2);
    return p;
  });
  let squareLines = squareVertices.map((v, i) => {
    let line = createRef<Line>();
    view.add(
      <Line
        ref={line}
        points={[v, squareVertices[(i + 1) % squareVertices.length]]}
        stroke={MainColors.obstacles}
        lineWidth={15}
        endOffset={0}
        zIndex={1}
        end={0}
      />
    );
    return line;
  });
  let entitiesTxt = createRef<Txt>();
  let edgesTxt = createRef<Txt>();
  view.add(
    <Txt
      ref={entitiesTxt}
      fontSize={50}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      y={-325}
      x={-400}
    />
  );
  view.add(
    <Txt
      ref={edgesTxt}
      fontSize={50}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      y={350}
      x={75}
    />
  );
  let entitesArrow = createRef<Line>();
  let edgesArrow = createRef<Line>();
  view.add(
    <Line
      ref={entitesArrow}
      points={[
        new Vector2(-425, -290),
        new Vector2(-425, -270),
        new Vector2(-300, -270),
      ]}
      stroke={MainColors.text}
      lineWidth={15}
      radius={10}
      endOffset={0}
      endArrow={true}
      zIndex={1}
      end={0}
    />
  );
  view.add(
    <Line
      ref={edgesArrow}
      points={[
        new Vector2(-15, 350),
        new Vector2(-125, 350),
        new Vector2(-125, 295),
      ]}
      stroke={MainColors.text}
      lineWidth={15}
      radius={10}
      endArrow={true}
      zIndex={1}
      end={0}
    />
  );
  yield* chain(
    all(
      sequence(0.3, ...squarePoints.map((p) => p().size(35, 0.375))),
      sequence(0.3, ...squareLines.map((l) => l().end(1, 0.375)))
    ),
    all(
      entitiesTxt().text("Entities (vertices)", 1),
      edgesTxt().text("Edges", 1),
      entitesArrow().end(1, 1),
      edgesArrow().end(1, 1)
    )
  );

  yield* waitUntil("visGraph");

  yield* all(
    visibilityGraphTxt().text("Visibility Graph", 1),
    entitiesTxt().text("", 1),
    edgesTxt().text("", 1),
    entitesArrow().end(0, 1),
    edgesArrow().end(0, 1),
    ...squarePoints.map((p) => p().size(0, 1)),
    ...squareLines.map((l) => l().end(0, 1))
  );

  let obs = createRef<Rect>();
  view.add(
    <Rect
      ref={obs}
      width={0}
      height={0}
      fill={MainColors.obstacles}
      radius={15}
      stroke={MainColors.border}
      lineWidth={2}
    />
  );

  let vertices = [
    new Vector2(350, 450),
    new Vector2(450, -250),
    new Vector2(600, 25),
    new Vector2(-350, 450),
    new Vector2(-450, -250),
    new Vector2(-600, 25),
  ];

  let edges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 5],
    [1, 2],
    [1, 4],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 5],
  ];

  let vertexObjs = vertices.map((v) =>
    drawPoint(view, v, 0, MainColors.path)()
  );

  let edgeObjs = edges.map(([a, b]) => {
    let line = createRef<Line>();
    view.add(
      <Line
        ref={line}
        points={[vertices[a], vertices[b]]}
        stroke={MainColors.blue.desaturate(1)}
        lineWidth={10}
        endOffset={0}
        zIndex={-1}
        end={0}
      />
    );
    return line;
  });

  yield* waitUntil("graph2");
  yield* all(obs().width(250, 1), obs().height(450, 1));
  yield* waitUntil("vertices");
  yield* all(...vertexObjs.map((v) => v.size(35, 1)));
  yield* waitUntil("edges");
  yield* sequence(0.15, ...edgeObjs.map((e) => e().end(1, 1)));
  yield* waitFor(1.5);
});
