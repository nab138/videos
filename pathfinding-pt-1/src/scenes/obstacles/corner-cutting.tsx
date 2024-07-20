import {
  Camera,
  Circle,
  Code,
  CODE,
  Grid,
  Img,
  insert,
  Line,
  makeScene2D,
  Rect,
  remove,
  replace,
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
import BrokenComputer from "../../../resources/brokencomputer.jpg";
import { drawPoint, inflateShape, Robot } from "../../utils";
import { CodeBlock } from "../../components/CodeBlock";
import { ImageFeature } from "../../components/ImageFeature";
import MinkowskiWebpage from "../../../resources/minkowski.mp4";
import { VideoFeature } from "../../components/VideoFeature";

export default makeScene2D(function* (view) {
  let fieldScale = 90;
  let inflationDist = 258.38;
  let camera = createRef<Camera>();
  let text = createRefMap<Txt>();

  view.add(<Camera ref={camera}></Camera>);
  let field = createRef<Grid>();
  view.add(
    <Grid
      ref={field}
      width={"100%"}
      height={"100%"}
      stroke={"#666"}
      lineWidth={3}
      spacing={fieldScale}
      zIndex={-99}
      end={0}
    />
  );

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
  triangle().remove();
  square().remove();
  text.noWorksFor().remove();
  text.triangleAngleTxt().remove();
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
  yield all(
    text.cornerCutting().fontSize(80, 1),
    text.cornerCutting().y(-425, 1),
    field().end(1, 1)
  );
  yield* waitFor(0.5);
  let vertices = [
    new Vector2(-3, -3).scale(fieldScale),
    new Vector2(3, 3).scale(fieldScale),
    new Vector2(-3, 3).scale(fieldScale),
  ];

  let dupedVertices = [];
  for (let v of vertices) {
    dupedVertices.push(new Vector2(v.x, v.y));
    dupedVertices.push(new Vector2(v.x, v.y));
  }
  let obs = createRef<Line>();
  view.add(
    <Line
      ref={obs}
      fill={MainColors.obstacles}
      radius={10}
      stroke={MainColors.border}
      lineWidth={2}
      points={dupedVertices}
      closed
      scale={0}
    />
  );

  let vertexTable = createRef<CodeBlock>();
  view.add(
    <CodeBlock
      ref={vertexTable}
      code={`Vertex[] vertexTable = {
  new Vertex(-3.00, 3.00),
  new Vertex(3.00, -3.00),
  new Vertex(-3.00, -3.00)
};`}
      fontSize={36}
      language="java"
      x={-1350}
    />
  );
  let edgeTable = createRef<CodeBlock>();
  view.add(
    <CodeBlock
      ref={edgeTable}
      code={`Edge[] edgeTable = {
  new Edge(0, 1),
  new Edge(1, 2),
  new Edge(2, 0)
};`}
      fontSize={36}
      language="java"
      x={1350}
    />
  );
  yield* all(
    obs().scale(1, 1),
    vertexTable().x(-7 * fieldScale, 1),
    edgeTable().x(7 * fieldScale, 1)
  );

  let vertexCircles = vertices.map((v) =>
    drawPoint(obs(), v, 0, MainColors.path)
  );

  yield* all(...vertexCircles.map((v) => v().size(25, 1)));

  yield* waitUntil("Two Copies");

  yield* vertexTable().codeBlock().code.edit(1)`Vertex[] vertexTable = {
  new Vertex(-3.00, 3.00),${insert(`
  new Vertex(-3.00, 3.00),
  new Vertex(-3.00, 3.00),`)}
  new Vertex(3.00, -3.00),${insert(`
  new Vertex(3.00, -3.00),
  new Vertex(3.00, -3.00),`)}
  new Vertex(-3.00, -3.00)${insert(`,
  new Vertex(-3.00, -3.00),
  new Vertex(-3.00, -3.00)`)}
};`;

  yield* waitUntil("smalldist");
  let vCopiesOne = vertices.map((v) => {
    let p = drawPoint(obs(), v, 17, MainColors.blue);
    p().zIndex(-1);
    return p;
  });
  let vectorsOne = vertices.map((v, i) =>
    new Vector2(vertices[(i + 1) % vertices.length])
      .sub(v)
      .normalized.scale(0.25 * fieldScale)
  );
  let vCopiesTwo = vertices.map((v) => {
    let p = drawPoint(obs(), v, 17, MainColors.blue);
    p().zIndex(-1);
    return p;
  });
  let vectorsTwo = vertices.map((v, i) =>
    new Vector2(vertices[(i + 2) % vertices.length])
      .sub(v)
      .normalized.scale(0.25 * fieldScale)
  );

  let vSignalsOneX = vCopiesOne.map((v) =>
    Code.createSignal(() => (v().x() / fieldScale).toFixed(2))
  );
  let vSignalsOneY = vCopiesOne.map((v) =>
    Code.createSignal(() => (-v().y() / fieldScale).toFixed(2))
  );
  let vSignalsTwoX = vCopiesTwo.map((v) =>
    Code.createSignal(() => (v().x() / fieldScale).toFixed(2))
  );
  let vSignalsTwoY = vCopiesTwo.map((v) =>
    Code.createSignal(() => (-v().y() / fieldScale).toFixed(2))
  );

  vertexTable().codeBlock().code(CODE`Vertex[] vertexTable = {
  new Vertex(-3.00, 3.00),
  new Vertex(${vSignalsOneX[0]}, ${vSignalsOneY[0]}),
  new Vertex(${vSignalsTwoX[0]}, ${vSignalsTwoY[0]}),
  new Vertex(3.00, -3.00),
  new Vertex(${vSignalsOneX[1]}, ${vSignalsOneY[1]}),
  new Vertex(${vSignalsTwoX[1]}, ${vSignalsTwoY[1]}),
  new Vertex(-3.00, -3.00),
  new Vertex(${vSignalsOneX[2]}, ${vSignalsOneY[2]}),
  new Vertex(${vSignalsTwoX[2]}, ${vSignalsTwoY[2]}),
};`);

  let notice = createRef<Txt>();
  view.add(
    <Txt
      ref={notice}
      text={
        "This distance is actually something like 0.0000001m, but it's shown larger here to make things clearer."
      }
      fontSize={36}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      y={650}
    />
  );
  yield* all(
    ...vCopiesOne.map((v, i) =>
      v().position(vertices[i].add(vectorsOne[i]), 1)
    ),
    ...vCopiesTwo.map((v, i) => v().position(vertices[i].add(vectorsTwo[i]), 1))
  );
  yield* notice().y(450, 1);
  let newVertices: Vector2[] = [];
  for (let i = 0; i < vertices.length; i++) {
    let v1 = vCopiesTwo[i]().position();
    let v2 = vCopiesOne[i]().position();
    newVertices.push(v1, v2);
  }
  yield* waitUntil("RemoveOriginal");

  yield* all(
    ...vertexCircles.map((v) => v().size(0, 1)),
    obs().points(newVertices, 1),
    vertexTable().codeBlock().code.edit(1)`Vertex[] vertexTable = {${remove(`
  new Vertex(-3.00, 3.00),`)}
  new Vertex(${vSignalsOneX[0]}, ${vSignalsOneY[0]}),
  new Vertex(${vSignalsTwoX[0]}, ${vSignalsTwoY[0]}),${remove(`
  new Vertex(3.00, -3.00),`)}
  new Vertex(${vSignalsOneX[1]}, ${vSignalsOneY[1]}),
  new Vertex(${vSignalsTwoX[1]}, ${vSignalsTwoY[1]}),${remove(`
  new Vertex(-3.00, -3.00),`)}
  new Vertex(${vSignalsOneX[2]}, ${vSignalsOneY[2]}),
  new Vertex(${vSignalsTwoX[2]}, ${vSignalsTwoY[2]}),
};`
  );

  yield* waitUntil("edgeTable");
  yield* edgeTable().codeBlock().code.edit(1)`Edge[] edgeTable = {
  new Edge(0, 1),
  new Edge(1, 2),
  new Edge(2, 3),
  new Edge(3, ${replace("0", "4")})${insert(`,
  new Edge(4, 5),
  new Edge(5, 6),
  new Edge(6, 7),
  new Edge(7, 0),`)}
};`;
  yield* waitUntil("after");
  yield* all(
    notice().y(650, 1),
    vertexTable().x(-1350, 1),
    edgeTable().x(1350, 1),
    text.cornerCutting().y(-600, 1)
  );
  notice().remove();
  vertexTable().remove();
  edgeTable().remove();

  let inflatedVertices = inflateShape(newVertices, inflationDist / 2);

  let obsDup = createRef<Line>();
  view.add(
    <Line
      ref={obsDup}
      radius={10}
      stroke={MainColors.path}
      opacity={0}
      lineWidth={10}
      points={newVertices}
      closed
    />
  );
  yield* waitUntil("inflation");
  yield* all(obsDup().points(inflatedVertices, 1), obsDup().opacity(1, 1));
  yield* waitUntil("complicated");
  yield* all(
    obs().points(dupedVertices, 1),
    obsDup().points(dupedVertices, 1),
    obsDup().opacity(0, 1),
    ...vCopiesOne.map((v, i) => v().position(vertices[i], 1)),
    ...vCopiesTwo.map((v, i) => v().position(vertices[i], 1))
  );
  robot
    .body()
    .rotation(0)
    .position(new Vector2(-7 * fieldScale, 0));

  circumcircle().stroke(MainColors.blue);
  circleCenter().fill(MainColors.path);

  yield* sequence(
    0.5,
    robot.animateIn(1),
    circumcircle().end(1, 1),
    circleCenter().size(25, 1)
  );
  let circumcircles = vertices.map(() => {
    let circumcircle = createRef<Circle>();
    view.add(
      <Circle
        ref={circumcircle}
        size={258.38}
        position={robot.body().position()}
        stroke={MainColors.blue}
        lineWidth={10}
      />
    );
    drawPoint(circumcircle(), new Vector2(0, 0), 25, MainColors.path);
    return circumcircle;
  });
  yield* waitUntil("originalVertex");
  yield* sequence(
    0.25,
    ...circumcircles.map((c, i) => c().position(vertices[i], 1))
  );
  yield* all(
    robot.animateOut(1),
    circumcircle().end(0, 1),
    circleCenter().size(0, 1)
  );
  yield* waitUntil("translateEdges");
  let edgesPoints = vertices.map((v, i) => [
    v,
    vertices[(i + 1) % vertices.length],
  ]);
  let edges = edgesPoints.map((e) => {
    let edge = createRef<Line>();
    view.add(
      <Line ref={edge} points={e} stroke={MainColors.path} lineWidth={0} />
    );
    return edge;
  });
  let normals = vectorsOne.map((v) =>
    v.normalized.perpendicular.scale(inflationDist / 2)
  );
  yield* all(
    ...edges.map((e) => e().lineWidth(10, 1)),
    ...edges.map((e, i) => {
      let points = edgesPoints[i];
      let normal = normals[i];
      let newPoints = points.map((p) => p.add(normal));

      return e().points(newPoints, 1);
    })
  );
  yield* waitUntil("back");
  yield* all(
    ...edges.map((e) => e().lineWidth(0, 1)),
    ...edges.map((e, i) => e().points(edgesPoints[i], 1))
  );

  let cornerCutEdgePoints = newVertices.map((v, i) => [
    v,
    newVertices[(i + 1) % newVertices.length],
  ]);

  let cornerCutEdges = cornerCutEdgePoints.map((e) => {
    let edge = createRef<Line>();
    view.add(
      <Line ref={edge} points={e} stroke={MainColors.path} lineWidth={0} />
    );
    return edge;
  });

  let cornerCutNormals = cornerCutEdgePoints.map((v) => {
    let normal = v[1]
      .sub(v[0])
      .normalized.perpendicular.scale(inflationDist / 2);
    return normal;
  });
  yield* waitUntil("cornerCutting");

  yield* chain(
    all(
      obs().points(newVertices, 1),
      ...vCopiesOne.map((v, i) =>
        v().position(vertices[i].add(vectorsOne[i]), 1)
      ),
      ...vCopiesTwo.map((v, i) =>
        v().position(vertices[i].add(vectorsTwo[i]), 1)
      )
    ),
    all(
      ...cornerCutEdges.map((e) => e().lineWidth(10, 1)),
      ...cornerCutEdges.map((e, i) => {
        let points = cornerCutEdgePoints[i];
        let normal = cornerCutNormals[i];
        let newPoints = points.map((p) => p.add(normal));

        return e().points(newPoints, 1);
      })
    )
  );

  yield* waitUntil("extremelySmall");
  vectorsOne = vertices.map((v, i) =>
    new Vector2(vertices[(i + 1) % vertices.length])
      .sub(v)
      .normalized.scale(0.05 * fieldScale)
  );
  vectorsTwo = vertices.map((v, i) =>
    new Vector2(vertices[(i + 2) % vertices.length])
      .sub(v)
      .normalized.scale(0.05 * fieldScale)
  );
  newVertices = [];
  for (let i = 0; i < vertices.length; i++) {
    let v1 = vertices[i].add(vectorsTwo[i]);
    let v2 = vertices[i].add(vectorsOne[i]);
    newVertices.push(v1, v2);
  }
  cornerCutEdgePoints = newVertices.map((v, i) => [
    v,
    newVertices[(i + 1) % newVertices.length],
  ]);

  cornerCutNormals = cornerCutEdgePoints.map((v) => {
    let normal = v[1]
      .sub(v[0])
      .normalized.perpendicular.scale(inflationDist / 2);
    return normal;
  });
  yield* all(
    ...vCopiesOne.map((v, i) =>
      v().position(vertices[i].add(vectorsOne[i]), 1)
    ),
    ...vCopiesTwo.map((v, i) =>
      v().position(vertices[i].add(vectorsTwo[i]), 1)
    ),
    obs().points(newVertices, 1),
    ...cornerCutEdges.map((e, i) => {
      let points = cornerCutEdgePoints[i];
      let normal = cornerCutNormals[i];
      let newPoints = points.map((p) => p.add(normal));

      return e().points(newPoints, 1);
    })
  );

  yield* waitUntil("behavior");
  inflatedVertices = inflateShape(newVertices, inflationDist / 2);

  obsDup().zIndex(99);
  yield* all(
    ...cornerCutEdges.map((e) => e().lineWidth(0, 1)),
    obsDup().opacity(1, 1),
    obsDup().points(inflatedVertices, 1)
  );

  yield* waitUntil("hack");

  let image = createRef<ImageFeature>();
  view.add(
    <ImageFeature
      ref={image}
      name={"ThisAlgorithm.png"}
      image={BrokenComputer}
      featureWidth={view.height() / 1.5}
      width={view.width()}
      height={view.height()}
      zIndex={99999}
      featureY={1000}
    />
  );
  yield* image().slideInVertical(1);
  yield* waitUntil("hackDismiss");
  yield* image().slideOutVertical(1000, 1);

  let video = createRef<VideoFeature>();
  view.add(
    <VideoFeature
      videoSource={MinkowskiWebpage}
      ref={video}
      text={
        "Webpage ⋅ Minkowski sum of convex polygons\nhttps://cp-algorithms.com/geometry/minkowski.html"
      }
      videoWidth={1080}
      videoHeight={608}
      featureY={1000}
      width={view.width()}
      height={view.height()}
      zIndex={999999999}
    />
  );

  yield* waitUntil("real");

  video().play();
  yield* video().slideInVertical(1.25);
  yield* waitUntil("realDismiss");
  yield* video().slideOutVertical(1000, 1);

  yield* waitUntil("step");
});
