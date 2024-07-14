import {
  Camera,
  Grid,
  Latex,
  Layout,
  Rect,
  makeScene2D,
} from "@motion-canvas/2d";
import {
  Color,
  Direction,
  Vector2,
  all,
  createRef,
  easeInOutQuad,
  sequence,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { MainColors } from "../../styles";
import {
  VisualVector,
  drawDefinition,
  drawLine,
  drawPoint,
  drawRect,
} from "../../utils";

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
    obs(),
    [
      new Vector2(-2 * fieldScale - inflationDist, -2 * fieldScale),
      new Vector2(-2 * fieldScale - inflationDist, 2 * fieldScale),
    ],
    15,
    MainColors.path
  );
  let topLine = drawLine(
    obs(),
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
      obs(),
      new Vector2(-2 * fieldScale, 2 * fieldScale),
      MainColors.blue,
      0.75
    ),
    rightVec.animateIn(
      obs(),
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
      position={new Vector2(6 * fieldScale, 600)}
      // ((p1 - p2) x v2) / v1 x v2
      tex={`\\color{white}r = \\mathbf{P} + s(\\vec{\\mathbf{v}})`}
      height={70}
    />
  );
  yield* waitUntil("this");
  yield* all(rayTex().y(0, 1));
  yield* waitUntil("points");
  leftVec.pointOnTop(obs());
  rightVec.pointOnTop(obs());
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
  leftVec.lineOnTop(obs());
  rightVec.lineOnTop(obs());
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

  let p1 = drawPoint(
    field(),
    new Vector2(2 * fieldScale, -2 * fieldScale),
    0,
    MainColors.path.darken(0.5)
  );
  let p2 = drawPoint(
    field(),
    new Vector2(-2 * fieldScale, 2 * fieldScale),
    0,
    MainColors.path.darken(0.5)
  );
  yield* waitUntil("pointAway");
  yield* all(p1().size(20, 0.5), p2().size(20, 0.5));

  // Add a layout with centered text on top and a line from the left to right edge of the dynamicly resizing rect
  let sRec = createRef<Layout>();
  field().add(
    <Rect
      opacity={0}
      height={100}
      layout
      justifyContent={"center"}
      alignItems={"center"}
      ref={sRec}
      direction={"column"}
      bottomRight={rightVec.point().top}
    >
      <Latex height={35} tex={"\\color{white}s"} />
    </Rect>
  );
  let measureRect = createRef<Rect>();
  sRec().add(
    <Rect
      ref={measureRect}
      height={10}
      fill={MainColors.text}
      marginTop={10}
      left={sRec().left}
      right={sRec().right}
      width={0}
    />
  );
  yield* waitUntil("s");

  yield* sRec().opacity(1, 0.75);
  yield* all(
    p1().x(-5 * fieldScale, 2),
    p2().y(-5 * fieldScale, 2),
    sRec().width(7 * fieldScale, 2),
    measureRect().width(7 * fieldScale, 2)
  );

  yield* waitUntil("fade");

  yield* all(sRec().opacity(0, 1), p1().opacity(0, 1), p2().opacity(0, 1));

  yield* waitUntil("two rays");

  let twoRayTex = createRef<Latex>();
  field().add(
    <Latex
      ref={twoRayTex}
      position={new Vector2(4 * fieldScale, 600)}
      tex={`\\color{white}\\begin{align}&r_{\\scriptsize 1} = \\mathbf{P_{\\scriptsize 1}} + s(\\vec{\\mathbf{v_{\\scriptsize 1}}}) \\\\
      &r_{\\scriptsize 2} = \\mathbf{P_{\\scriptsize 2}} + t(\\vec{\\mathbf{v_{\\scriptsize 2}}})\\end{align}`}
      height={160}
    />
  );
  let p1labelTex = createRef<Latex>();
  field().add(
    <Latex
      ref={p1labelTex}
      position={new Vector2(-1.4 * fieldScale, -2 * fieldScale - inflationDist)}
      tex={`\\color{white}\\mathbf{P_{\\scriptsize 1}}`}
      width={65}
      opacity={0}
    />
  );
  let v1labelTex = createRef<Latex>();
  field().add(
    <Latex
      ref={v1labelTex}
      position={new Vector2(-2.35 * fieldScale, -2.75 * fieldScale)}
      tex={`\\color{white}\\vec{\\mathbf{v_{\\scriptsize 1}}}`}
      width={65}
      opacity={0}
    />
  );
  let p2labelTex = createRef<Latex>();
  field().add(
    <Latex
      ref={p2labelTex}
      position={new Vector2(-6 * fieldScale - inflationDist, 2.6 * fieldScale)}
      tex={`\\color{white}\\mathbf{P_{\\scriptsize 2}}`}
      width={65}
      opacity={0}
    />
  );
  let v2labelTex = createRef<Latex>();
  field().add(
    <Latex
      ref={v2labelTex}
      position={new Vector2(-6.6 * fieldScale, 1.65 * fieldScale)}
      tex={`\\color{white}\\vec{\\mathbf{v_{\\scriptsize 2}}}`}
      width={65}
      opacity={0}
    />
  );

  let ep1 = drawPoint(
    obs(),
    new Vector2(2 * fieldScale, -2 * fieldScale - inflationDist),
    0,
    MainColors.path.darken(0.5)
  );
  let ep2 = drawPoint(
    obs(),
    new Vector2(-2 * fieldScale - inflationDist, 2 * fieldScale),
    0,
    MainColors.path.darken(0.5)
  );

  yield* all(
    rayTex().x(1200, 1),
    twoRayTex().y(0, 1),
    obs().x(-4 * fieldScale, 1)
  );
  yield all(
    v1labelTex().opacity(1, 1),
    p1labelTex().opacity(1, 1),
    v2labelTex().opacity(1, 1),
    p2labelTex().opacity(1, 1),
    ep1().size(25, 1),
    ep2().size(25, 1)
  );

  yield* waitUntil("separate");
  let r1x = createRef<Latex>();
  field().add(
    <Latex
      ref={r1x}
      position={new Vector2(4 * fieldScale, -700)}
      tex={`\\color{white}r_{{\\small 1}_x} = \\mathbf{P_{{\\small 1}_x}} + s(\\mathbf{v_{{\\small 1}_x}})`}
      width={550}
    />
  );
  let r1y = createRef<Latex>();
  field().add(
    <Latex
      ref={r1y}
      position={new Vector2(4 * fieldScale, -600)}
      tex={`\\color{white}r_{{\\small 1}_y} = \\mathbf{P_{{\\small 1}_y}} + s(\\mathbf{v_{{\\small 1}_y}})`}
      width={550}
    />
  );
  let r2x = createRef<Latex>();
  field().add(
    <Latex
      ref={r2x}
      position={new Vector2(4 * fieldScale, 600)}
      tex={`\\color{white}r_{{\\small 2}_x} = \\mathbf{P_{{\\small 2}_x}} + t(\\mathbf{v_{{\\small 2}_x}})`}
      width={550}
    />
  );
  let r2y = createRef<Latex>();
  field().add(
    <Latex
      ref={r2y}
      position={new Vector2(4 * fieldScale, 700)}
      tex={`\\color{white}r_{{\\small 2}_y} = \\mathbf{P_{{\\small 2}_y}} + t(\\mathbf{v_{{\\small 2}_y}})`}
      width={550}
    />
  );
  yield* all(
    twoRayTex().x(1200, 1),
    r1x().y(-250, 1),
    r1y().y(-150, 1),
    r2x().y(150, 1),
    r2y().y(250, 1)
  );

  yield* waitUntil("xEqual");
  let xEqualTex = createRef<Latex>();
  field().add(
    <Latex
      ref={xEqualTex}
      position={new Vector2(15 * fieldScale, 0)}
      tex={`\\\color{white}\\mathbf{P_{{\\small 1}_x}} + s(\\mathbf{v_{{\\small 1}_x}}) = \\mathbf{P_{{\\small 2}_x}} + t(\\mathbf{v_{{\\small 2}_x}})`}
      width={780}
    />
  );
  yield* sequence(
    0.25,
    all(
      r1x().x(15 * fieldScale, 1),
      r2x().x(15 * fieldScale, 1),
      xEqualTex().x(4 * fieldScale, 1)
    ),
    r1y().y(-250, 1)
  );

  yield* waitUntil("yEqual");
  let yEqualTex = createRef<Latex>();
  field().add(
    <Latex
      ref={yEqualTex}
      position={new Vector2(15 * fieldScale, 100)}
      tex={`\\\color{white}\\mathbf{P_{{\\small 1}_y}} + s(\\mathbf{v_{{\\small 1}_y}}) = \\mathbf{P_{{\\small 2}_y}} + t(\\mathbf{v_{{\\small 2}_y}})`}
      width={780}
    />
  );
  yield* all(
    r1y().x(15 * fieldScale, 1),
    r2y().x(15 * fieldScale, 1),
    yEqualTex().x(4 * fieldScale, 1),
    xEqualTex().y(-100, 1)
  );

  let bg = createRef<Rect>();
  field().add(
    <Rect
      ref={bg}
      fill={"#000"}
      opacity={0}
      width={field().width()}
      height={field().height()}
    />
  );
  let definition = drawDefinition(
    field(),
    new Vector2(0, 650),
    "System of Equations",
    '"Two or more equations that share variables"'
  );
  yield* waitUntil("soe");
  yield* all(bg().opacity(0.6, 1), definition.bg().y(0, 1));
  yield* waitUntil("soeDismiss");
  yield* all(bg().opacity(0, 1), definition.bg().y(650, 1));

  yield* waitUntil("answer");

  let intersectTex = createRef<Latex>();
  field().add(
    <Latex
      ref={intersectTex}
      position={new Vector2(15 * fieldScale, 0)}
      height={170}
      // ((p1 - p2) x v2) / v1 x v2
      tex={`\\color{white}s = \\frac{(\\mathbf{P_{\\scriptsize 1}} - \\mathbf{P_{\\scriptsize 2}}) \\times \\vec{\\mathbf{v}}_{\\scriptsize 2}}{\\vec{\\mathbf{v}}_{\\scriptsize 1} \\times \\vec{\\mathbf{v}}_{\\scriptsize 2}}`}
    />
  );

  let crossProductTex = createRef<Latex>();
  field().add(
    <Latex
      ref={crossProductTex}
      position={new Vector2(4 * fieldScale, 600)}
      height={85}
      // ((p1 - p2) x v2) / v1 x v2
      tex={`\\color{white}\\vec{a} \\times \\vec{b} = a_{\\scriptsize x}b_{\\scriptsize y} - a_{\\scriptsize y}b_{\\scriptsize x}`}
    />
  );
  yield* all(
    yEqualTex().y(1000, 1),
    xEqualTex().y(-1000, 1),
    intersectTex().x(4 * fieldScale, 1)
  );
  yield* waitUntil("defined");
  yield* all(intersectTex().y(-150, 1), crossProductTex().y(150, 1));
  yield* waitUntil("valueOfS");
  let sValueTex = createRef<Latex>();
  field().add(
    <Latex
      ref={sValueTex}
      position={new Vector2(4 * fieldScale, 600)}
      tex={
        `\\color{white}s \\approx ` +
        ((4 * fieldScale + inflationDist) / fieldScale).toFixed(2)
      }
      height={55}
    />
  );
  yield* all(crossProductTex().x(15 * fieldScale, 1), sValueTex().y(150, 1));
  yield* waitUntil("scale");
  yield* rightVec.x(-4 * fieldScale - inflationDist, 1);
  yield* waitUntil("translate");
  yield* ep1().x(-2 * fieldScale - inflationDist, 1);
  yield* waitUntil("mathDismiss");
  let finalBtRPt = drawPoint(
    field(),
    new Vector2(
      2 * fieldScale + inflationDist,
      -2 * fieldScale - inflationDist
    ),
    0,
    MainColors.path.darken(0.5)
  );
  let finalBtLPt = drawPoint(
    field(),
    new Vector2(
      -2 * fieldScale - inflationDist,
      2 * fieldScale + inflationDist
    ),
    0,
    MainColors.path.darken(0.5)
  );
  let finalTRPt = drawPoint(
    field(),
    new Vector2(2 * fieldScale + inflationDist, 2 * fieldScale + inflationDist),
    0,
    MainColors.path.darken(0.5)
  );
  yield* sequence(
    0.6,
    all(
      p1labelTex().opacity(0, 1),
      p2labelTex().opacity(0, 1),
      v1labelTex().opacity(0, 1),
      v2labelTex().opacity(0, 1)
    ),
    all(
      sValueTex().x(15 * fieldScale, 1),
      intersectTex().x(15 * fieldScale, 1),
      obs().x(0, 1)
    ),
    all(
      leftVec.animateOut(1),
      rightVec.animateOut(1),
      leftLine().end(0, 1),
      topLine().end(0, 1),
      ep2().size(0, 1)
    ),
    sequence(
      0.15,
      finalBtLPt().size(25, 1),
      finalBtRPt().size(25, 1),
      finalTRPt().size(25, 1)
    )
  );
  yield* waitUntil("connect");
  let inflatedObs = drawRect(
    field(),
    new Vector2(0, 0),
    4 * fieldScale + 2 * inflationDist,
    4 * fieldScale + 2 * inflationDist,
    new Color("#00000000"),
    10,
    2,
    MainColors.path.desaturate(1).darken(1)
  );
  inflatedObs().zIndex(-1).end(0);
  yield* inflatedObs().end(1, 2, easeInOutQuad);
  twoRayTex().remove();
  intersectTex().remove();
  yEqualTex().remove();
  xEqualTex().remove();
  yield* waitFor(2);
});
