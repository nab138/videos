import {
  Camera,
  Circle,
  CODE,
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

import Overview from "../../../resources/overview.png";
import { Fonts, MainColors } from "../../styles";
import { DefinitionFeature } from "../../components/DefinitionFeature";
import { drawPoint, inflateShape } from "../../utils";
import { CodeBlock } from "../../components/CodeBlock";

export default makeScene2D(function* (view) {
  yield* slideTransition(Direction.Right, 1);
  const fieldScale = 90;

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
        end={0}
        spacing={fieldScale}
      />
    </Camera>
  );

  let centerLineY = createRef<Line>();
  field().add(
    <Line
      ref={centerLineY}
      stroke={"white"}
      lineWidth={5}
      points={[new Vector2(0, view.height()), new Vector2(0, -view.height())]}
      end={0}
    />
  );
  let centerLineX = createRef<Line>();
  field().add(
    <Line
      ref={centerLineX}
      stroke={"white"}
      lineWidth={5}
      points={[new Vector2(view.width(), 0), new Vector2(-view.width(), 0)]}
      end={0}
    />
  );

  camera().scene().position(view.size().div(2));

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
  field().add(
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
  yield* waitUntil("obstacleas");
  let obs2 = createRef<Rect>();
  field().add(
    <Rect
      ref={obs2}
      width={0}
      height={0}
      fill={MainColors.obstacles}
      radius={15}
      stroke={MainColors.border}
      lineWidth={2}
      x={3 * fieldScale}
      y={-2 * fieldScale}
      rotation={-35}
    />
  );
  yield* all(
    visibilityGraphTxt().text("", 1),
    ...vertexObjs.map((p) => p.size(0, 1)),
    ...edgeObjs.map((e) => e().end(0, 1)),
    obs().width(fieldScale * 2, 1),
    obs().height(fieldScale * 4, 1),
    obs().x(-fieldScale * 3, 1),
    obs().y(fieldScale * 1, 1),
    obs2().width(fieldScale * 2, 1),
    obs2().height(fieldScale * 2, 1)
  );
  let inflatedObs1Coords = inflateShape(
    [
      new Vector2(-fieldScale, -fieldScale * 2).add(obs().position()),
      new Vector2(fieldScale, -fieldScale * 2).add(obs().position()),
      new Vector2(fieldScale, fieldScale * 2).add(obs().position()),
      new Vector2(-fieldScale, fieldScale * 2).add(obs().position()),
    ],
    90
  );

  let inflatedObs1Points = inflatedObs1Coords.map((v) =>
    drawPoint(field(), v, 0, MainColors.path)
  );

  let inflatedObs2Coords = inflateShape(
    [
      new Vector2(-fieldScale, -fieldScale)
        .rotate(obs2().rotation())
        .add(obs2().position()),
      new Vector2(fieldScale, -fieldScale)
        .rotate(obs2().rotation())
        .add(obs2().position()),
      new Vector2(fieldScale, fieldScale)
        .rotate(obs2().rotation())
        .add(obs2().position()),
      new Vector2(-fieldScale, fieldScale)
        .rotate(obs2().rotation())
        .add(obs2().position()),
    ],
    90
  );

  let inflatedObs2Points = inflatedObs2Coords.map((v) =>
    drawPoint(field(), v, 0, MainColors.path)
  );

  let occludeBlock = createRef<Rect>();
  view.add(
    <Rect
      ref={occludeBlock}
      width={0}
      height={view.height()}
      x={-view.width() / 2}
      offset={[-1, 0]}
      fill={"#0d0d0d"}
      opacity={1}
      stroke={"#666"}
      lineWidth={3}
    />
  );

  let vertexTable = createRef<CodeBlock>();
  view.add(
    <CodeBlock
      ref={vertexTable}
      code={
        `Vertex[] vertexTable = {
` +
        [...inflatedObs1Coords, ...inflatedObs2Coords]
          .map(
            (v) =>
              `  new Vertex(${(v.x / fieldScale).toFixed(2)}, ${(
                v.y / fieldScale
              ).toFixed(2)}),`
          )
          .join("\n") +
        `
};`
      }
      fontSize={36}
      language="java"
      y={-1050}
      offset={[-1, -1]}
      x={() => -view.width() / 2 + 50}
    />
  );

  let area = view.width() - vertexTable().width() - 100;
  yield* sequence(
    0.25,
    all(
      field().end(1, 1),
      camera().position(
        [view.width() / 2 - area / 2 - vertexTable().width() - 100, 0],
        1
      ),
      occludeBlock().width(view.width() - area, 1),
      centerLineX().end(1, 1),
      centerLineY().end(1, 1)
    ),
    all(
      ...inflatedObs1Points.map((p) => p().size(25, 1)),
      ...inflatedObs2Points.map((p) => p().size(25, 1))
    )
  );

  yield* waitUntil("vertexTable");
  yield* vertexTable().y(() => -view.height() / 2 + 50, 1);

  let edgeTable = createRef<CodeBlock>();
  view.add(
    <CodeBlock
      ref={edgeTable}
      code={`Edge[] edgeTable = {

};`}
      fontSize={36}
      language="java"
      y={600}
      offset={[-1, -1]}
      x={() => -view.width() / 2 + 50}
    />
  );
  yield* waitUntil("edgeTable");
  yield* edgeTable().y(
    () => -view.height() / 2 + 100 + vertexTable().height(),
    1
  );
  yield* waitUntil("scratch");
  yield* edgeTable().codeBlock().code.insert([1, 0], `  // ???`, 0.5);
  yield* waitUntil("reset");
  yield* all(
    camera().position([0, 0], 1),
    occludeBlock().width(0, 1),
    vertexTable().x(-1600, 1),
    edgeTable().x(-1600, 1)
  );
  yield* waitUntil("visgraph");
  yield* waitFor(10);
});
