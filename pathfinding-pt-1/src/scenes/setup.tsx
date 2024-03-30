import {
  Grid,
  Latex,
  Txt,
  makeScene2D,
  insert,
  lines,
  useScene2D,
} from "@motion-canvas/2d";
import { CameraView } from "@ksassnowski/motion-canvas-camera";
import {
  DEFAULT,
  Direction,
  Vector2,
  all,
  any,
  chain,
  createRef,
  createSignal,
  easeInCubic,
  easeInOutCubic,
  easeInOutQuad,
  easeInQuad,
  easeOutCubic,
  linear,
  sequence,
  slideTransition,
  tween,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import Colors from "../colors";
import { Robot, VisualVector, drawCode, drawLine, drawPoint } from "../utils";
import { ThreeCanvas, axisAngle } from "motion-canvas-3d";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";

export default makeScene2D(function* (view) {
  yield* slideTransition(Direction.Bottom, 0.5);
  let fieldScale = 90;

  let camera = createRef<CameraView>();
  view.add(<CameraView ref={camera} width={"100%"} height={"100%"} />);

  const { x: canvasWidth, y: canvasHeight } = useScene2D().getSize();

  const c = new ThreeCanvas({ canvasWidth, canvasHeight });

  c.camera.position([0, 0, -1.975]);
  c.camera.quaternion([1, 0, 0, 0]);

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

  c.threeScene.background = new THREE.Color("rgb(13, 13, 13)");

  c.create(() => {
    const size = 10.1;
    const divisions = 40;
    const step = size / divisions;
    const halfSize = size / 2;

    const points = [];

    for (let i = 0; i <= divisions; i++) {
      const value = i * step - halfSize;

      // Horizontal line
      points.push(new THREE.Vector3(-halfSize, value, 0));
      points.push(new THREE.Vector3(halfSize, value, 0));

      // Vertical line
      points.push(new THREE.Vector3(value, -halfSize, 0));
      points.push(new THREE.Vector3(value, halfSize, 0));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new MeshLine();
    line.setGeometry(geometry);

    const material = new MeshLineMaterial({
      color: new THREE.Color(0x909090),
      lineWidth: 30, // Adjust this value to change the line thickness
      sizeAttenuation: 0,
      resolution: new THREE.Vector2(canvasWidth, canvasHeight),
      transparent: false,
    });

    const mesh = new THREE.Mesh(line, material);
    return mesh;
  });

  c.create(() => {
    const light = new THREE.HemisphereLight(0xffffff, 0xfffffff, 1.0);
    return light;
  });

  const group = new THREE.Group();

  // Create the first box and add it to the group
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1, 0.4),
    new THREE.MeshStandardMaterial({ color: Colors.dozer.body })
  );
  group.add(body);

  // Create the second box and add it to the group
  const plow = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.1, 0.4),
    new THREE.MeshStandardMaterial({ color: Colors.dozer.wheels3D })
  );
  plow.position.set(0, -0.55, 0); // Adjust the position as needed
  group.add(plow);

  [
    new Vector2(-0.42, 0.3),
    new Vector2(-0.42, 0),
    new Vector2(-0.42, -0.3),
    new Vector2(0.42, 0.3),
    new Vector2(0.42, 0),
    new Vector2(0.42, -0.3),
  ].forEach((position) => {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: Colors.dozer.wheels3D })
    );
    wheel.position.set(position.x, position.y, 0.2); // Adjust the position as needed
    group.add(wheel);
  });

  const [dozer3D] = c.push(group);

  camera().add(c);

  dozer3D.scale([0, 0, 0]);

  yield* dozer3D.scale([1, 1, 1], 1);

  yield* chain(
    // Rotate camera 45 degrees around the z-axis
    tween(0.5, (tRaw) => {
      let t = easeInCubic(tRaw);
      c.camera.quaternion(
        axisAngle(new THREE.Vector3(1, 0, 0), (Math.PI / 4) * t)
      );
    }),
    tween(1.0, (tRaw) => {
      let t = easeOutCubic(tRaw);
      // Define the start and end positions
      let startPos = new THREE.Vector3(0, 0, -1.975);
      let endPos = new THREE.Vector3(-1, 1, -0.9); // adjust this as needed

      // Interpolate between the start and end positions
      let pos = startPos.lerp(endPos, t);

      c.camera.position([pos.x, pos.y, pos.z]);
      c.camera.lookAt([0, 0, 0]);
      c.camera.quaternion(
        axisAngle(new THREE.Vector3(1, 0, 0), (Math.PI / 4) * t)
      );
      c.threeCamera.up.set(0, 0, -1);
    })
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
