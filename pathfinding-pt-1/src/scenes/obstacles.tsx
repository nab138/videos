import { CameraView } from "@ksassnowski/motion-canvas-camera";
import { Grid, Txt, makeScene2D } from "@motion-canvas/2d";
import {
  Direction,
  Vector2,
  all,
  createRef,
  sequence,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import Colors from "../colors";
import { drawCode, drawPoint, drawLine } from "../utils";

export default makeScene2D(function* (view) {
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
      lineWidth={3}
      spacing={fieldScale}
    />
  );
  yield* all(slideTransition(Direction.Bottom, 1), field().stroke("#444", 1));

  let text = createRef<Txt>();
  field().add(
    <Txt
      ref={text}
      x={0}
      y={-400}
      text={"Obstacles"}
      fill={Colors.text}
      fontFamily={Colors.font}
      fontSize={1 * fieldScale}
      opacity={0}
      // Add outline
      stroke={Colors.backgroundDark}
    />
  );
  yield* waitUntil("obstacles");

  yield* text().opacity(1, 1);

  yield* waitUntil("Vertex Table");

  let vertexTable = drawCode(
    field(),
    new Vector2(-500, 750),
    `
         
`,
    "rust",
    48
  );

  let vertexTableText = createRef<Txt>();
  vertexTable
    .codeBackground()
    .add(
      <Txt
        ref={vertexTableText}
        x={0}
        y={200}
        text={"Vertex Table"}
        fill={Colors.text}
        fontFamily={Colors.font}
        fontSize={0.75 * fieldScale}
      />
    );

  yield* vertexTable.codeBackground().position(new Vector2(-500, -50), 1);

  yield* waitUntil("Edge Table");
  let edgeTable = drawCode(
    field(),
    new Vector2(500, 750),
    `    

`,
    "java",
    48
  );

  let edgeTableText = createRef<Txt>();
  edgeTable
    .codeBackground()
    .add(
      <Txt
        ref={edgeTableText}
        x={0}
        y={200}
        text={"Edge Table"}
        fill={Colors.text}
        fontFamily={Colors.font}
        fontSize={0.75 * fieldScale}
      />
    );

  yield* edgeTable.codeBackground().position(new Vector2(500, -50), 1);

  yield* waitUntil("vertexTable");

  yield* edgeTable.codeBackground().position(new Vector2(500, 750), 0.75);

  yield* waitUntil("corners");

  let v1 = drawPoint(
    field(),
    new Vector2(1 * fieldScale, 1 * fieldScale),
    0,
    Colors.path
  );
  let v2 = drawPoint(
    field(),
    new Vector2(2 * fieldScale, -1 * fieldScale),
    0,
    Colors.path
  );
  let v3 = drawPoint(
    field(),
    new Vector2(3 * fieldScale, 1 * fieldScale),
    0,
    Colors.path
  );

  yield* sequence(
    1,
    all(
      vertexTable.codeBlock().code(
        `0: (0, 0)

`,
        0.75
      ),
      v1().size(25, 0.75)
    ),
    all(
      vertexTable.codeBlock().code(
        `0: (0, 0)
1: (1, 2)
`,
        0.75
      ),
      v2().size(25, 0.75)
    ),
    all(
      vertexTable.codeBlock().code(
        `0: (0, 0)
1: (1, 2)
2: (2, 0)`,
        0.75
      ),
      v3().size(25, 0.75)
    )
  );
  yield* waitUntil("edgeTable");
  edgeTable.codeBackground().position(new Vector2(-0, 750));
  yield* all(
    edgeTable.codeBackground().position(new Vector2(-0, -50), 1),
    vertexTable.codeBackground().position(new Vector2(-550, -50), 1),
    v1().position(new Vector2(5 * fieldScale, 1 * fieldScale), 1),
    v2().position(new Vector2(6 * fieldScale, -1 * fieldScale), 1),
    v3().position(new Vector2(7 * fieldScale, 1 * fieldScale), 1)
  );
  yield* waitUntil("indices");
  let l1 = drawLine(
    field(),
    [v1().position(), v2().position()],
    10,
    Colors.path
  );
  let l2 = drawLine(
    field(),
    [v2().position(), v3().position()],
    10,
    Colors.path
  );
  let l3 = drawLine(
    field(),
    [v3().position(), v1().position()],
    10,
    Colors.path
  );
  l1().end(0);
  l2().end(0);
  l3().end(0);
  yield* sequence(
    1,
    all(
      edgeTable.codeBlock().code(
        `0, 1

        `,
        0.75
      ),
      l1().end(1, 0.75)
    ),
    all(
      edgeTable.codeBlock().code(
        `0, 1
1, 2
        `,
        0.75
      ),
      l2().end(1, 0.75)
    ),
    all(
      edgeTable.codeBlock().code(
        `0, 1
1, 2
2, 0`,
        0.75
      ),
      l3().end(1, 0.75)
    )
  );
  yield* waitFor(20);
});
