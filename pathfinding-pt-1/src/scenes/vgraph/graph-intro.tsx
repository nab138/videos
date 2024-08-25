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
  createSignal,
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
import { drawPoint, inflateShape, Robot } from "../../utils";
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

  let inflatedObs1Points = inflatedObs1Coords.map((v) => {
    let p = drawPoint(field(), v, 0, MainColors.path);
    p().zIndex(9);
    return p;
  });

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

  let inflatedObs2Points = inflatedObs2Coords.map((v) => {
    let p = drawPoint(field(), v, 0, MainColors.path);
    p().zIndex(9);
    return p;
  });

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
  let allFieldVs = inflatedObs1Points.concat(inflatedObs2Points);
  let fieldEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
  ];
  let fieldLines = fieldEdges.map(([a, b]) => {
    let line = createRef<Line>();
    field().add(
      <Line
        ref={line}
        points={[allFieldVs[a]().position(), allFieldVs[b]().position()]}
        stroke={MainColors.obstacles}
        lineWidth={15}
        endOffset={0}
        end={0}
      />
    );
    return line;
  });
  let fieldVisEdges = [
    [0, 4],
    [0, 5],
    [1, 4],
    [1, 5],
    [1, 7],
    [2, 4],
    [2, 6],
    [2, 7],
  ];
  let fieldVisLines = fieldVisEdges.map(([a, b]) => {
    let line = createRef<Line>();
    field().add(
      <Line
        ref={line}
        points={[allFieldVs[a]().position(), allFieldVs[b]().position()]}
        stroke={MainColors.blue.desaturate(1)}
        lineWidth={10}
        endOffset={0}
        end={0}
      />
    );
    return line;
  });
  let adjacentFieldVisLines = fieldEdges.map(([a, b]) => {
    let line = createRef<Line>();
    field().add(
      <Line
        ref={line}
        points={[allFieldVs[a]().position(), allFieldVs[b]().position()]}
        stroke={MainColors.blue.desaturate(1)}
        lineWidth={10}
        endOffset={0}
        end={0}
      />
    );
    return line;
  });

  yield* sequence(
    0.1,
    ...[...adjacentFieldVisLines, ...fieldVisLines].map((l) => l().end(1, 1))
  );
  yield* waitUntil("adjacent");
  yield* sequence(0.05, ...adjacentFieldVisLines.map((l) => l().end(0, 0.75)));
  yield* waitUntil("intersect");
  yield* sequence(0.05, ...fieldLines.map((l) => l().end(1, 0.75)));
  yield* waitUntil("solve");
  yield* sequence(0.05, ...fieldVisLines.map((l) => l().end(0, 0.75)));
  yield* waitUntil("inflateAgain");
  let extraInflateAmount = createSignal(0);
  let inflatedObs1Points2 = inflatedObs1Coords.map((v, i) => {
    let p = drawPoint(field(), v, 15, MainColors.path.brighten(0.5));
    p().zIndex(8);
    p().position(
      () => inflateShape(inflatedObs1Coords, extraInflateAmount())[i]
    );
    return p;
  });
  let inflatedObs2Points2 = inflatedObs2Coords.map((v, i) => {
    let p = drawPoint(field(), v, 15, MainColors.path.brighten(0.5));
    p().zIndex(8);
    p().position(
      () => inflateShape(inflatedObs2Coords, extraInflateAmount())[i]
    );
    return p;
  });
  yield* extraInflateAmount(20, 1);
  yield* waitUntil("slightlyMore");
  let notice = createRef<Txt>();
  view.add(
    <Txt
      ref={notice}
      text={
        "Again, the distance is actually something like 0.0000001m, but it's shown larger here for clarity."
      }
      fontSize={36}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      y={650}
    />
  );
  yield* notice().y(460, 1);
  yield* waitUntil("pathVertices");
  let pVerticesLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={pVerticesLabel}
      text={""}
      fontSize={50}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      y={-270}
      x={-650}
    />
  );
  let pVerticesArrow = createRef<Line>();
  view.add(
    <Line
      ref={pVerticesArrow}
      points={[
        new Vector2(-650, -230),
        new Vector2(-650, -202),
        new Vector2(-500, -202),
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
  yield* all(
    notice().y(650, 1),
    sequence(
      0.4,
      pVerticesLabel().text("Path Vertices", 1),
      pVerticesArrow().end(1, 1)
    )
  );

  let oEdgesLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={oEdgesLabel}
      text={""}
      fontSize={50}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      y={1.5 * fieldScale}
      x={-700}
    />
  );
  let oEdgesArrow = createRef<Line>();
  view.add(
    <Line
      ref={oEdgesArrow}
      points={[
        new Vector2(-700, 170),
        new Vector2(-700, 210),
        new Vector2(-480, 210),
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

  let oVerticesLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={oVerticesLabel}
      text={""}
      fontSize={50}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      y={280}
      x={250}
    />
  );
  let oVerticesArrow = createRef<Line>();
  view.add(
    <Line
      ref={oVerticesArrow}
      points={[
        new Vector2(250, 310),
        new Vector2(250, 358),
        new Vector2(-50, 358),
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
  yield* waitUntil("obstacleEdges");
  yield* sequence(
    0.4,
    oEdgesLabel().text("Obstacle Edges", 1),
    oEdgesArrow().end(1, 1)
  );
  yield* waitUntil("obstacleVertices");
  yield* sequence(
    0.4,
    oVerticesLabel().text("Obstacle Vertices", 1),
    oVerticesArrow().end(1, 1)
  );
  yield* waitUntil("anotherIssue");
  yield* sequence(
    0.1,
    all(pVerticesArrow().end(0, 1), pVerticesLabel().text("", 1)),
    all(oEdgesArrow().end(0, 1), oEdgesLabel().text("", 1)),
    all(oVerticesArrow().end(0, 1), oVerticesLabel().text("", 1))
  );
  let definition = createRef<DefinitionFeature>();
  view.add(
    <DefinitionFeature
      ref={definition}
      word={"Pre-Processing"}
      definition={
        "Work that is done to the data beforehand to make it easier to use and require less work at runtime."
      }
      featureWidth={view.height() / 1.5}
      width={view.width()}
      height={view.height()}
      featureY={1000}
      pads={25}
    />
  );
  yield* waitUntil("definition");
  yield* definition().slideInVertical(1);
  yield* waitUntil("definitionDismiss");
  yield* definition().slideOutVertical(1000, 1);
  yield* waitUntil("robot");
  let robot = Robot.dozer(
    field(),
    new Vector2(-7 * fieldScale, fieldScale * 2),
    fieldScale * 2
  );
  let robotCenter = createRef<Circle>();
  field().add(
    <Circle
      ref={robotCenter}
      size={0}
      fill={MainColors.green}
      x={-7 * fieldScale}
      y={fieldScale * 2}
      zIndex={1000}
    />
  );
  yield* all(robot.animateIn(1), robotCenter().size(25, 1));
  yield* waitUntil("target");
  let target = createRef<Circle>();
  field().add(
    <Circle
      ref={target}
      size={0}
      fill={MainColors.green}
      x={6 * fieldScale}
      y={-4 * fieldScale}
      zIndex={1000}
    />
  );
  yield* target().size(25, 1);
  yield* waitUntil("wontKnow");
  let qMarkOne = createRef<Circle>();
  let qMarkTwo = createRef<Txt>();
  view.add(
    <Circle
      ref={qMarkOne}
      fill={"#333a"}
      opacity={0}
      size={300}
      x={-7 * fieldScale}
      y={fieldScale * 2}
    >
      <Txt
        text={"?"}
        fontSize={300}
        fill={MainColors.text}
        fontFamily={Fonts.main}
      />
    </Circle>
  );

  view.add(
    <Circle
      ref={qMarkTwo}
      fill={"#333a"}
      opacity={0}
      size={200}
      x={6 * fieldScale}
      y={fieldScale * -4}
    >
      <Txt
        text={"?"}
        fontSize={200}
        fill={MainColors.text}
        fontFamily={Fonts.main}
      />
    </Circle>
  );
  yield* all(qMarkOne().opacity(1, 1), qMarkTwo().opacity(1, 1));
  yield* waitUntil("stranded");
  let inflatedVerts = [...inflatedObs1Points2, ...inflatedObs2Points2];
  let pathVisLines = [...fieldVisEdges, ...fieldEdges].map(([a, b]) => {
    let line = createRef<Line>();
    field().add(
      <Line
        ref={line}
        points={[inflatedVerts[a]().position(), inflatedVerts[b]().position()]}
        stroke={MainColors.blue.desaturate(1)}
        lineWidth={10}
        endOffset={0}
        end={0}
      />
    );
    return line;
  });
  let robotConnections = [0, 3];
  let robotLines = robotConnections.map((i) => {
    let line = createRef<Line>();
    field().add(
      <Line
        ref={line}
        points={[robot.body().position(), inflatedVerts[i]().position()]}
        stroke={MainColors.green}
        lineWidth={10}
        zIndex={9999}
        endOffset={0}
        opacity={0.75}
        lineDash={[20, 10]}
        end={0}
      />
    );
    return line;
  });
  let xPositions = robotLines.map(
    (l, i) => l().getPointAtPercentage(i == 1 ? 0.7 : 0.5).position
  );
  // Exes are two lines that intersect at the xPosition, [line, line]
  let Exes = xPositions.map((p) => {
    let line1 = createRef<Line>();
    let line2 = createRef<Line>();
    field().add(
      <Line
        ref={line1}
        points={[
          p.add(new Vector2(-fieldScale / 3, fieldScale / 3)),
          p.add(new Vector2(fieldScale / 3, -fieldScale / 3)),
        ]}
        stroke={MainColors.path}
        lineWidth={10}
        zIndex={9999}
        endOffset={0}
        end={0}
      />
    );
    field().add(
      <Line
        ref={line2}
        points={[
          p.add(new Vector2(-fieldScale / 3, -fieldScale / 3)),
          p.add(new Vector2(fieldScale / 3, fieldScale / 3)),
        ]}
        stroke={MainColors.path}
        lineWidth={10}
        zIndex={9999}
        endOffset={0}
        end={0}
      />
    );
    return [line1, line2];
  });
  let test = Exes.map(([l1, l2]) => [l1().end(1, 1), l2().end(1, 1)]);
  let xTotals = [];
  for (let i = 0; i < test.length; i++) {
    xTotals.push(...test[i]);
  }

  let textBox = createRef<Rect>();
  let text = createRef<Txt>();
  field().add(
    <Rect
      ref={textBox}
      width={() => 350}
      height={() => text().height() + 50}
      fill={MainColors.backgroundDark.brighten(0.5)}
      radius={15}
      stroke={MainColors.border}
      lineWidth={2}
      x={-8 * fieldScale}
      y={-fieldScale * 2}
      opacity={0}
    >
      <Txt
        ref={text}
        width={300}
        textWrap={true}
        text={
          "These don't exist beause the robot's position wasn't known when we made the visibility graph"
        }
        fontSize={24}
        fill={MainColors.text}
        fontFamily={Fonts.main}
      />
    </Rect>
  );

  let arrow = createRef<Line>();
  field().add(
    <Line
      ref={arrow}
      points={[
        new Vector2(-8 * fieldScale, -fieldScale * 1),
        new Vector2(-8 * fieldScale, -fieldScale * 0.3),
        new Vector2(-6.5 * fieldScale, -fieldScale * 0.3),
      ]}
      stroke={MainColors.text}
      lineWidth={15}
      endArrow={true}
      radius={10}
      end={0}
    />
  );

  yield* chain(
    all(
      qMarkOne().opacity(0, 1),
      qMarkTwo().opacity(0, 1),
      sequence(0.025, ...pathVisLines.map((l) => l().end(1, 0.75)))
    ),
    all(...robotLines.map((l) => l().end(1, 1))),
    all(...xTotals, textBox().opacity(1, 1), arrow().end(1, 1))
  );
  yield* waitFor(10);
});
