import { Camera, Grid, Latex, Rect, makeScene2D } from "@motion-canvas/2d";
import {
  Direction,
  Vector2,
  all,
  chain,
  createRef,
  sequence,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { MainColors } from "../styles";
import { VisualVector, drawLine, drawPoint, drawRect } from "../utils";

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

  let inflationDist = 258.38 / 2;

  camera().scene().position(view.size().div(2));
  let obs = drawRect(
    field(),
    new Vector2(0, 0),
    4 * fieldScale,
    4 * fieldScale,
    MainColors.obstacles,
    2,
    15,
    MainColors.border
  );
  obs().opacity(0.9);
  let leftLine = drawLine(
    field(),
    [
      new Vector2(-2 * fieldScale - inflationDist, -2 * fieldScale),
      new Vector2(-2 * fieldScale - inflationDist, 2 * fieldScale),
    ],
    15,
    MainColors.path
  );
  let topLine = drawLine(
    field(),
    [
      new Vector2(-2 * fieldScale, -2 * fieldScale - inflationDist),
      new Vector2(2 * fieldScale, -2 * fieldScale - inflationDist),
    ],
    15,
    MainColors.path
  );
  yield* all(slideTransition(Direction.Left, 1), field().stroke("#444", 1));
  yield* waitUntil("rays");
  leftLine().startArrow(true).arrowSize(0);
  topLine().startArrow(true).arrowSize(0);
  let leftPoint = drawPoint(
    field(),
    new Vector2(-2 * fieldScale - inflationDist, 2 * fieldScale),
    0,
    MainColors.blue
  );
  let rightPoint = drawPoint(
    field(),
    new Vector2(2 * fieldScale, -2 * fieldScale - inflationDist),
    0,
    MainColors.blue
  );
  yield* sequence(
    1.5,
    all(
      leftLine().arrowSize(40, 1),
      topLine().arrowSize(40, 1),
      leftPoint().size(35, 1),
      rightPoint().size(35, 1)
    ),
    all(
      leftLine().arrowSize(0, 1),
      topLine().arrowSize(0, 1),
      leftPoint().size(0, 1),
      rightPoint().size(0, 1)
    )
  );
  let leftVec = new VisualVector(0, 0, 15, 35);
  let rightVec = new VisualVector(0, 0, 15, 35);
  yield* waitUntil("adjacent");
  yield* all(
    leftVec.animateIn(
      field(),
      new Vector2(-2 * fieldScale, 2 * fieldScale),
      MainColors.blue,
      0.75
    ),
    rightVec.animateIn(
      field(),
      new Vector2(2 * fieldScale, -2 * fieldScale),
      MainColors.blue,
      0.75
    )
  );
  yield* waitUntil("toThePoint");
  yield* all(
    leftVec.y(-4 * fieldScale + 10, 1),
    rightVec.x(-4 * fieldScale + 10, 1)
  );
  yield* waitUntil("normalize");
  yield* all(
    leftVec.normalize(fieldScale, 1),
    rightVec.normalize(fieldScale, 1),
    leftVec.line().arrowSize(30, 1),
    rightVec.line().arrowSize(30, 1)
  );
  let rayTex = createRef<Latex>();
  field().add(
    <Latex
      ref={rayTex}
      fill={MainColors.text}
      fontFamily="Poppins"
      fontSize={50}
      position={new Vector2(6 * fieldScale, 600)}
      // ((p1 - p2) x v2) / v1 x v2
      tex={`r = \\mathbf{P} + s(\\vec{\\mathbf{v}})`}
    />
  );
  yield* waitUntil("this");
  yield* all(rayTex().y(0, 1));
  yield* waitUntil("points");
  leftVec.pointOnTop(field());
  rightVec.pointOnTop(field());
  yield* sequence(
    1.25,
    all(
      leftVec.point().fill(MainColors.blue.brighten(1.5), 0.75),
      rightVec.point().fill(MainColors.blue.brighten(1.5), 0.75)
    ),
    all(
      leftVec.point().fill(MainColors.blue, 0.75),
      rightVec.point().fill(MainColors.blue, 0.75)
    )
  );
  leftVec.lineOnTop(field());
  rightVec.lineOnTop(field());
  yield* waitUntil("directionVector");
  yield* sequence(
    1.25,
    all(
      leftVec.line().stroke(MainColors.blue.brighten(1.5), 0.75),
      rightVec.line().stroke(MainColors.blue.brighten(1.5), 0.75)
    ),
    all(
      leftVec.line().stroke(MainColors.blue, 0.75),
      rightVec.line().stroke(MainColors.blue, 0.75)
    )
  );
  yield* waitUntil("pointAlong");

  let intersectTex = createRef<Latex>();
  field().add(
    <Latex
      ref={intersectTex}
      fill={MainColors.text}
      fontFamily="Poppins"
      fontSize={50}
      position={new Vector2(6 * fieldScale, 620)}
      // ((p1 - p2) x v2) / v1 x v2
      tex={`s = \\frac{(\\mathbf{P} - \\mathbf{Q}) \\times \\vec{\\mathbf{v}}_2}{\\vec{\\mathbf{v}}_1 \\times \\vec{\\mathbf{v}}_2}`}
    />
  );
  yield* waitFor(25);
});
