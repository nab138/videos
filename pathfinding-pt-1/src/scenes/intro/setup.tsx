import {
  Grid,
  Latex,
  Txt,
  makeScene2D,
  insert,
  lines,
  useScene2D,
  Rect,
} from "@motion-canvas/2d";
import {
  Color,
  DEFAULT,
  Direction,
  Vector2,
  all,
  any,
  chain,
  createRef,
  createSignal,
  delay,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  linear,
  sequence,
  slideTransition,
  tween,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Fonts, MainColors } from "../../styles";
import {
  VisualVector,
  drawCode,
  drawLine,
  drawPoint,
  drawRect,
} from "../../utils";
import { ThreeCanvas, axisAngle } from "motion-canvas-3d";
import * as THREE from "three";
import {
  addLight,
  draw3DDozer,
  draw3DGrid,
  draw3DPoint,
  drawVector,
} from "../../3dutils";

export default makeScene2D(function* (view) {
  yield* slideTransition(Direction.Bottom, 0.5);
  let fieldScale = 90;
  const { x: canvasWidth, y: canvasHeight } = useScene2D().getSize();

  let field = createRef<Grid>();
  view.add(
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

  let text = createRef<Txt>();
  field().add(
    <Txt
      ref={text}
      x={0}
      y={-400}
      text={"Vertices & Vectors"}
      fill={MainColors.text}
      fontFamily={Fonts.main}
      fontSize={1 * fieldScale}
      opacity={0}
      stroke={MainColors.backgroundDark}
    />
  );

  yield* waitUntil("vertices");

  let vertex = drawPoint(
    field(),
    new Vector2(-2 * fieldScale, 0),
    0,
    MainColors.path,
    0
  );

  yield* vertex().size(40, 1);

  yield delay(0.25, text().opacity(1, 1.5));

  yield* waitUntil("vectors");

  let vector = new VisualVector(fieldScale * 2, -fieldScale * 2, 10);

  yield* vector.animateIn(
    field(),
    new Vector2(2 * fieldScale, 0),
    MainColors.path
  );

  yield* waitUntil("vertex");

  yield* all(text().opacity(0, 1), vector.animateOut(1), vertex().x(0, 1));

  yield* waitUntil("dozer");

  const c = new ThreeCanvas({ canvasWidth, canvasHeight, fov: 10 });

  // Use an orthographic camera
  c.camera.position([0, 0, -20]);
  c.camera.quaternion([1, 0, 0, 0]);

  c.threeScene.background = new THREE.Color("rgb(13, 13, 13)");

  draw3DGrid(c, canvasWidth, canvasHeight, 101, 346, 0xa6a6a6, 15.75);

  let [dirLight, ambLight] = addLight(c, 0xffffff, 3);

  field().view().add(c);

  let point3D = draw3DPoint(
    c,
    new THREE.Vector3(0, 0, 0),
    new THREE.Color(MainColors.path.hex()),
    0.065
  );

  let dozer3D = draw3DDozer(c);

  dozer3D.position([-0.585, 0, -0.3]);
  dozer3D.scale([0, 0, 0]);
  dozer3D.quaternion(axisAngle(new THREE.Vector3(0, 1, 0), Math.PI));

  yield* all(dozer3D.scale([1, 1, 1], 1), point3D.position([0.585, 0, 0], 1));
  yield* all(
    tween(0.5, (tRaw) => {
      let t = easeInOutCubic(tRaw);
      dirLight.intensity = t * 3;
      // Bring ambLight from 3 to 1
      ambLight.intensity = 3 - t * 2;
    }),
    chain(
      // Rotate camera 45 degrees around the z-axis
      tween(0.5, (tRaw) => {
        let t = easeInCubic(tRaw);
        c.camera.quaternion(
          axisAngle(new THREE.Vector3(1, 0, 0), (Math.PI / 4) * t)
        );
      }),
      () => c.camera.lookAt([0, 0, 0]),
      tween(1.0, (tRaw) => {
        let t = easeOutCubic(tRaw);
        // Define the start and end positions
        let startPos = new THREE.Vector3(0, 0, -20);
        let endPos = new THREE.Vector3(-6, 6, -5); // adjust this as needed

        // Interpolate between the start and end positions
        let pos = startPos.lerp(endPos, t);

        c.camera.position([pos.x, pos.y, pos.z]);

        c.threeCamera.up.set(0, 0, -1);
      })
    )
  );

  yield* waitUntil("dozerMove");

  yield* chain(
    dozer3D.position([-0.585, 0, 0.3], 0.5),
    dozer3D.position([-0.585, 0, -0.9], 0.5),
    dozer3D.position([-0.585, 0, -0.3], 0.5)
  );

  let cornerX = -1;
  let cornerY = 0.61;
  let cornerZ = -0.09;
  // let yAxisVec = new VisualVector(0, -60, 3);
  // let xAxisVec = new VisualVector(60, 0, 3);
  let prevZVec = drawVector(
    c,
    new THREE.Vector3(cornerX, cornerY, cornerZ),
    new THREE.Vector3(cornerX, cornerY, cornerZ),
    new THREE.Color(0x0000ff),
    0.025,
    0,
    0
  );
  let prevYVec = drawVector(
    c,
    new THREE.Vector3(cornerX, cornerY, cornerZ),
    new THREE.Vector3(cornerX, cornerY, cornerZ),
    new THREE.Color(0x00ff00),
    0.025,
    0,
    0
  );
  let prevXVec = drawVector(
    c,
    new THREE.Vector3(cornerX, cornerY, cornerZ),
    new THREE.Vector3(cornerX, cornerY, cornerZ),
    new THREE.Color(0xff0000),
    0.025,
    0,
    0
  );

  let vecLength = 1.2;

  yield* waitUntil("dozerAxis");
  yield* tween(1, (tRaw) => {
    let t = easeInOutCubic(tRaw);
    c.threeScene.remove(prevZVec[0]);
    c.threeScene.remove(prevYVec[0]);
    c.threeScene.remove(prevXVec[0]);
    c.threeScene.remove(prevZVec[1]);
    c.threeScene.remove(prevYVec[1]);
    c.threeScene.remove(prevXVec[1]);
    prevZVec = drawVector(
      c,
      new THREE.Vector3(cornerX, cornerY, cornerZ),
      new THREE.Vector3(cornerX, cornerY, cornerZ - vecLength * t),
      new THREE.Color(0x0000ff),
      0.025,
      0.1 * t,
      0.1 * t
    );
    prevYVec = drawVector(
      c,
      new THREE.Vector3(cornerX, cornerY, cornerZ),
      new THREE.Vector3(cornerX, cornerY - vecLength * t, cornerZ),
      new THREE.Color(0x00ff00),
      0.025,
      0.1 * t,
      0.1 * t
    );
    prevXVec = drawVector(
      c,
      new THREE.Vector3(cornerX, cornerY, cornerZ),
      new THREE.Vector3(cornerX + vecLength * t, cornerY, cornerZ),
      new THREE.Color(0xff0000),
      0.025,
      0.1 * t,
      0.1 * t
    );
  });

  yield* waitUntil("2d");

  yield* all(
    tween(0.75, (tRaw) => {
      let t = easeInOutCubic(tRaw);
      dirLight.intensity = 3 - t * 3;
      // Bring ambLight from 3 to 1
      ambLight.intensity = 1 + t * 2;
    }),
    chain(
      tween(1.0, (tRaw) => {
        let t = Math.min(easeOutCubic(tRaw), 0.9999);
        // Define the start and end positions
        let endPos = new THREE.Vector3(0, 0, -20);
        let startPos = new THREE.Vector3(-6, 6, -5); // adjust this as needed

        // Interpolate between the start and end positions
        let pos = startPos.lerp(endPos, t);

        c.camera.position([pos.x, pos.y, pos.z]);
      }),
      tween(0.5, (tRaw) => {
        c.camera.setNoLookat(true);
        let t = easeInCubic(tRaw);
        c.camera.quaternion(
          axisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4 - (Math.PI / 4) * t)
        );
      })
    )
  );

  yield* waitUntil("2dField");

  yield* tween(0.5, (tRaw) => {
    let t = easeInOutCubic(tRaw);
    c.threeScene.remove(prevZVec[0]);
    c.threeScene.remove(prevZVec[1]);
    prevZVec = drawVector(
      c,
      new THREE.Vector3(cornerX, cornerY, cornerZ),
      new THREE.Vector3(cornerX, cornerY, cornerZ - vecLength + vecLength * t),
      new THREE.Color(0x0000ff),
      0.025,
      0.1 - 0.1 * t,
      0.1 - 0.1 * t
    );
  });

  yield* waitUntil("codeBlock");

  let bgRect = drawRect(
    view,
    new Vector2(0, 0),
    view.width,
    view.height,
    new Color("#00000066")
  );
  bgRect().opacity(0).zIndex(99);
  let { codeBlock, codeBackground } = drawCode(
    view,
    new Vector2(0, 700),
    `class Vertex {
  

}`
  );
  codeBlock().zIndex(1000);
  codeBackground().zIndex(999);

  yield* all(codeBackground().y(-50, 1), bgRect().opacity(1, 1));

  yield* waitUntil("xCoord");

  yield* all(
    codeBlock().code.edit(0.8)`class Vertex {
  ${insert("double x;")}

}`,
    codeBlock().selection(lines(1), 0.3)
  );

  yield* waitUntil("yCoord");

  yield* all(
    codeBlock().code.edit(0.8)`class Vertex {
  double x;
  ${insert("double y;")}
}`,
    codeBlock().selection(lines(2), 0.3)
  );

  yield* any(waitUntil("meters"), codeBlock().selection(DEFAULT, 1));

  yield* codeBlock().code.edit(1)`class Vertex {
  double x; ${insert("// in meters")}
  double y; ${insert("// in meters")}
}`;

  yield* waitUntil("codeDismiss");

  yield* sequence(
    0.1,
    all(codeBackground().y(700, 1), bgRect().opacity(0, 1)),
    all(
      dozer3D.scale([0, 0, 0], 1),
      tween(1, (tRaw) => {
        let t = 1 - easeInOutCubic(tRaw);
        c.threeScene.remove(prevYVec[0]);
        c.threeScene.remove(prevXVec[0]);
        c.threeScene.remove(prevYVec[1]);
        c.threeScene.remove(prevXVec[1]);
        prevYVec = drawVector(
          c,
          new THREE.Vector3(cornerX, cornerY, cornerZ),
          new THREE.Vector3(cornerX, cornerY - vecLength * t, cornerZ),
          new THREE.Color(0x00ff00),
          0.025,
          0.1 * t,
          0.1 * t
        );
        prevXVec = drawVector(
          c,
          new THREE.Vector3(cornerX, cornerY, cornerZ),
          new THREE.Vector3(cornerX + vecLength * t, cornerY, cornerZ),
          new THREE.Color(0xff0000),
          0.025,
          0.1 * t,
          0.1 * t
        );
      }),
      point3D.scale([0, 0, 0], 1)
    )
  );

  vertex().remove();
  c.remove();

  yield* waitUntil("vector");

  vector.point().position(new Vector2(0, 0));
  yield* all(vector.line().end(1, 1));

  yield* waitUntil("contexts");

  let rust = drawCode(
    field(),
    new Vector2(-450, 750),
    `let vector = vec!["hello", "world"];`,
    "rust",
    38
  );

  const tex = createRef<Latex>();
  field().add(
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

  tex().opacity(0);

  let measureLine1 = drawLine(
    field(),
    [new Vector2(0, 0), new Vector2(fieldScale * 4, 0)],
    5,
    MainColors.backgroundLight
  );
  measureLine1().lineDash([30, 10]);
  measureLine1().end(0);
  let measureLine2 = drawLine(
    field(),
    [
      new Vector2(fieldScale * 4, 0),
      new Vector2(fieldScale * 4, -fieldScale * 4),
    ],
    5,
    MainColors.backgroundLight
  );
  measureLine2().lineDash([30, 10]);
  measureLine2().end(0);

  let measureText1 = createRef<Txt>();

  let x = createSignal(0);
  field().add(
    <Txt
      ref={measureText1}
      fontFamily={Fonts.main}
      fill={MainColors.text}
      text={() => `x = ${x().toFixed(2)}`}
      x={fieldScale * 2}
      y={fieldScale}
      opacity={0}
    />
  );

  let measureText2 = createRef<Txt>();

  let y = createSignal(0);
  field().add(
    <Txt
      ref={measureText2}
      fontFamily={Fonts.main}
      fill={MainColors.text}
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
  field().add(
    <Latex
      ref={tex2}
      fill={MainColors.text}
      tex={() => `
\\begin{align}\\text{mag} = \\;&\\sqrt{x^2 + y^2} \\\\
\\text{mag} = \\;&\\sqrt{${x().toFixed(2)}^2 + ${y().toFixed(2)}^2} \\\\
\\text{mag} = \\;&\\sqrt{${(x() * x() + y() * y()).toFixed(2)}} \\\\
\\text{mag} \\approx  \\; &{${Math.sqrt(x() * x() + y() * y()).toFixed(
        3
      )}}\\end{align}`}
      y={-1 * fieldScale}
      x={-fieldScale * 4}
      fontSize={40}
      opacity={0}
    />
  );

  yield* tex2().opacity(1, 0.8);

  yield* waitUntil("definition");

  let vectorCode = drawCode(
    view,
    new Vector2(0, 750),
    `class Vector {
  

}`
  );
  vectorCode.codeBlock().zIndex(1000);
  vectorCode.codeBackground().zIndex(999);

  yield* all(vectorCode.codeBackground().y(0, 1), bgRect().opacity(1, 1));
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

  yield* all(vectorCode.codeBackground().y(700, 1), bgRect().opacity(0, 1));

  yield* waitUntil("normalizeEq");

  const tex3 = createRef<Latex>();
  const texBG = createRef<Rect>();
  view.add(
    <Rect
      ref={texBG}
      x={0}
      y={720}
      width={10 * fieldScale}
      height={4 * fieldScale}
      fill={MainColors.codeBackground}
      radius={25}
      shadowBlur={3}
      shadowColor={MainColors.shadow}
      shadowOffsetX={3}
      shadowOffsetY={3}
      zIndex={999}
    />
  );
  texBG().add(
    <Latex
      ref={tex3}
      fill={MainColors.text}
      tex={() => `(\\frac{x}{\\sqrt{x^2 +y^2}}, \\frac{y}{\\sqrt{x^2 +y^2}})`}
      y={-50}
      x={0}
      width={800} // height and width can calculate based on each other
    />
  );
  texBG().add(
    <Txt
      fill={MainColors.text}
      fontFamily={Fonts.main}
      fontSize={70}
      text="Normalization"
      zIndex={9999}
      y={125}
    />
  );

  yield* all(texBG().y(0, 1), bgRect().opacity(1, 1));

  yield* waitUntil("eqDismiss");

  yield* all(texBG().y(720, 1), bgRect().opacity(0, 1));

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
