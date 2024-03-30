import {
  Grid,
  Latex,
  Txt,
  makeScene2D,
  insert,
  lines,
} from "@motion-canvas/2d";
import { CameraView } from "@ksassnowski/motion-canvas-camera";
import {
  DEFAULT,
  Direction,
  Vector2,
  all,
  any,
  createRef,
  createSignal,
  easeInOutQuad,
  linear,
  sequence,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import Colors from "../colors";
import { Robot, VisualVector, drawCode, drawLine, drawPoint } from "../utils";

export default makeScene2D(function* (view) {
  yield* slideTransition(Direction.Bottom, 0.5);
  let fieldScale = 90;

  let camera = createRef<CameraView>();
  view.add(<CameraView ref={camera} width={"100%"} height={"100%"} />);

  let field = createRef<Grid>();
  camera().add(
    <Grid
      ref={field}
      width={"100%"}
      height={"100%"}
      stroke={"#666"}
      start={0}
      end={0}
      lineWidth={3}
      spacing={fieldScale}
    />
  );

  yield* all(field().end(1, 1));

  yield* waitUntil("vertices");

  let vertex = drawPoint(
    field(),
    new Vector2(-2 * fieldScale, 0),
    0,
    Colors.path,
    0
  );

  yield* vertex().size(40, 1);

  yield* waitUntil("vectors");

  let vector = new VisualVector(fieldScale * 2, -fieldScale * 2, 10);

  yield* vector.animateIn(field(), new Vector2(2 * fieldScale, 0), Colors.path);

  yield* waitUntil("vertex");

  yield* all(vector.animateOut(1), vertex().x(0, 1));

  yield* waitUntil("dozer");

  let dozer = Robot.dozer(
    field(),
    new Vector2(-fieldScale, 0),
    fieldScale * 1.5
  );

  yield* all(dozer.animateIn(1), vertex().x(fieldScale, 1));

  yield* waitUntil("dozerZoom");

  yield* camera().zoomOnto(dozer.body(), 1.5, 50, easeInOutQuad);

  let yAxisVec = new VisualVector(0, -60, 3);
  let xAxisVec = new VisualVector(60, 0, 3);

  yield* waitUntil("dozerAxis");

  yield* all(
    yAxisVec.animateIn(field(), new Vector2(-fieldScale, 0), "green"),
    xAxisVec.animateIn(field(), new Vector2(-fieldScale, 0), "red")
  );

  yield* all(
    camera().reset(1),
    yAxisVec.point().position(0, 1),
    yAxisVec.point().size(30, 1),
    yAxisVec.y(-300, 1.2),
    yAxisVec.line().lineWidth(10, 1),
    yAxisVec.line().arrowSize(25, 1),
    xAxisVec.point().position(0, 1),
    xAxisVec.point().size(30, 1),
    xAxisVec.x(300, 1.2),
    xAxisVec.line().lineWidth(10, 1),
    xAxisVec.line().arrowSize(25, 1)
  );

  yield* waitFor(0.2);
  yield* all(
    yAxisVec.point().size(0, 1),
    yAxisVec.line().lineWidth(0, 1),
    yAxisVec.line().arrowSize(0, 1),
    yAxisVec.line().end(0, 1),
    xAxisVec.point().size(0, 1),
    xAxisVec.line().lineWidth(0, 1),
    xAxisVec.line().arrowSize(0, 1),
    xAxisVec.line().end(0, 1)
  );

  yield* waitUntil("codeBlock");

  let { codeBlock, codeBackground } = drawCode(
    camera(),
    new Vector2(0, 700),
    `class Vertex {
  

}`
  );

  yield* codeBackground().y(-50, 1);

  yield* waitUntil("xCoord");

  yield* codeBlock().code.edit(0.8)`class Vertex {
  ${insert("double x;")}

}`;

  yield* waitUntil("yCoord");

  yield* codeBlock().code.edit(0.8)`class Vertex {
  double x;
  ${insert("double y;")}
}`;

  yield* any(waitUntil("meters"), codeBlock().selection(DEFAULT, 1));

  yield* codeBlock().code.edit(1)`class Vertex {
  double x; ${insert("// in meters")}
  double y; ${insert("// in meters")}
}`;

  yield* waitUntil("codeDismiss");

  yield* all(xAxisVec.point().size(0, 1), codeBackground().y(700, 1));

  yield* waitUntil("vector");

  vector.point().position(new Vector2(0, 0));
  yield* all(vector.line().end(1, 1), dozer.animateOut(1), vertex().size(0, 1));

  yield* waitUntil("contexts");

  let rust = drawCode(
    camera(),
    new Vector2(-450, 750),
    `let vector = vec!["hello", "world"];`,
    "rust",
    38
  );

  const tex = createRef<Latex>();
  camera().add(
    <Latex
      ref={tex}
      tex="{\color{white} \begin{bmatrix} w_1 \\ w_2 \\ \vdots \\ w_n \end{bmatrix} \;}"
      y={750}
      x={600}
      width={200} // height and width can calculate based on each other
    />
  );

  yield* all(rust.codeBackground().y(-250, 1), tex().y(-200, 1));

  yield* waitUntil("contextsEnds");

  yield* all(rust.codeBackground().y(750, 1), tex().y(750, 1));

  let measureLine1 = drawLine(
    camera(),
    [new Vector2(0, 0), new Vector2(fieldScale * 4, 0)],
    5,
    Colors.backgroundLight
  );
  measureLine1().lineDash([30, 10]);
  measureLine1().end(0);
  let measureLine2 = drawLine(
    camera(),
    [
      new Vector2(fieldScale * 4, 0),
      new Vector2(fieldScale * 4, -fieldScale * 4),
    ],
    5,
    Colors.backgroundLight
  );
  measureLine2().lineDash([30, 10]);
  measureLine2().end(0);

  let measureText1 = createRef<Txt>();

  let x = createSignal(0);
  camera().add(
    <Txt
      ref={measureText1}
      fontFamily={Colors.font}
      fill={Colors.text}
      text={() => `x = ${x().toFixed(2)}`}
      x={fieldScale * 2}
      y={fieldScale}
      opacity={0}
    />
  );

  let measureText2 = createRef<Txt>();

  let y = createSignal(0);
  camera().add(
    <Txt
      ref={measureText2}
      fontFamily={Colors.font}
      fill={Colors.text}
      text={() => `y = ${y().toFixed(2)}`}
      x={fieldScale * 6}
      y={-fieldScale * 2}
      opacity={0}
    />
  );

  yield* waitFor(0.4);
  yield* sequence(
    1.5,
    sequence(
      1,
      vector.x(-fieldScale * 2, 1).to(fieldScale * 4, 1),
      vector.y(-fieldScale * 4, 1)
    ),
    all(
      sequence(
        0.5,
        measureText1().opacity(1, 0.5),
        measureText2().opacity(1, 0.5)
      ),
      sequence(
        0.5,
        all(measureLine1().end(1, 0.8, linear), x(4, 0.8, linear)),
        all(measureLine2().end(1, 0.8, linear), y(4, 0.8, linear))
      )
    )
  );

  const tex2 = createRef<Latex>();
  camera().add(
    <Latex
      ref={tex2}
      tex={() => `
\\color{white}\\begin{align}\\text{mag} = &\\sqrt{x^2 + y^2} \\\\
\\text{mag} = &\\sqrt{{${x().toFixed(2)}}^2 + {${y().toFixed(2)}}^2} \\\\
\\text{mag} = &\\sqrt{{${(x() * x() + y() * y()).toFixed(2)}}}\\end{align}`}
      y={-fieldScale}
      x={-fieldScale * 4}
      width={500} // height and width can calculate based on each other
      opacity={0}
    />
  );

  yield* tex2().opacity(1, 0.8);

  yield* waitUntil("definition");

  let vectorCode = drawCode(
    camera(),
    new Vector2(0, 700),
    `class Vector {
  

}`
  );

  yield* vectorCode.codeBackground().y(-50, 1);

  yield* waitUntil("xCoord2");

  yield* all(
    vectorCode.codeBlock().code.edit(0.5)`class Vector {
  ${insert("double x; // in meters")}

}`,
    vectorCode.codeBlock().selection(lines(1), 0.2)
  );

  yield* all(
    vectorCode.codeBlock().code.edit(0.5)`class Vector {
  double x; // in meters
  ${insert("double y; // in meters")}
}`,
    vectorCode.codeBlock().selection(lines(2), 0.2)
  );

  yield* vectorCode.codeBlock().selection(DEFAULT, 0.5);

  yield* waitUntil("vecDismiss");

  yield* vectorCode.codeBackground().y(700, 1);

  yield* waitUntil("normalize");

  yield* all(
    x(0.70710678118, 1),
    y(0.70710678118, 1),
    vector.x(0.70710678118 * fieldScale, 1),
    vector.y(-0.70710678118 * fieldScale, 1),
    measureLine1().end(0.70710678118 / 4, 1),
    measureLine2().end(0.70710678118 / 4, 1),
    measureLine1().lineDash([15, 5], 1),
    measureLine2().lineDash([15, 5], 1),
    measureLine2().x(-fieldScale * 4 + 0.70710678118 * fieldScale, 1),
    measureText1().x((1 - 0.70710678118) * fieldScale, 1),
    measureText2().x((3 - 0.70710678118) * fieldScale, 1),
    measureText2().y((1 - 0.70710678118) * -fieldScale, 1)
  );
  yield* waitUntil("obstacleTransition");
});
