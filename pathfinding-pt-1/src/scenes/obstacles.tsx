import { Grid, Img, Txt, lines, makeScene2D } from "@motion-canvas/2d";
import {
  DEFAULT,
  Direction,
  Vector2,
  all,
  chain,
  createRef,
  linear,
  loop,
  sequence,
  slideTransition,
  waitUntil,
} from "@motion-canvas/core";
import { Fonts, MainColors } from "../styles";
import { drawCode, drawPoint, drawLine } from "../utils";
import cog from "../../resources/cog.svg";

export default makeScene2D(function* (view) {
  let fieldScale = 90;

  let field = createRef<Grid>();
  view.add(
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
      fill={MainColors.text}
      fontFamily={Fonts.main}
      fontSize={1 * fieldScale}
      opacity={0}
      // Add outline
      stroke={MainColors.backgroundDark}
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
        fill={MainColors.text}
        fontFamily={Fonts.main}
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
        fill={MainColors.text}
        fontFamily={Fonts.main}
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
    MainColors.path
  );
  let v2 = drawPoint(
    field(),
    new Vector2(2 * fieldScale, -1 * fieldScale),
    0,
    MainColors.path
  );
  let v3 = drawPoint(
    field(),
    new Vector2(3 * fieldScale, 1 * fieldScale),
    0,
    MainColors.path
  );

  yield* chain(
    all(
      vertexTable.codeBlock().code(
        `0: (0, 0)

`,
        1
      ),
      v1().size(25, 1)
    ),
    all(
      vertexTable.codeBlock().code(
        `0: (0, 0)
1: (1, 2)
`,
        1
      ),
      v2().size(25, 1)
    ),
    all(
      vertexTable.codeBlock().code(
        `0: (0, 0)
1: (1, 2)
2: (2, 0)`,
        1
      ),
      v3().size(25, 1)
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
    MainColors.path
  );
  let l2 = drawLine(
    field(),
    [v2().position(), v3().position()],
    10,
    MainColors.path
  );
  let l3 = drawLine(
    field(),
    [v3().position(), v1().position()],
    10,
    MainColors.path
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
      l1().end(1, 0.75),
      vertexTable.codeBlock().selection(lines(0, 1), 0.75),
      edgeTable.codeBlock().selection(lines(0), 0.75)
    ),
    all(
      edgeTable.codeBlock().code(
        `0, 1
1, 2
`,
        0.75
      ),
      l2().end(1, 0.75),
      vertexTable.codeBlock().selection(lines(1, 2), 0.75),
      edgeTable.codeBlock().selection(lines(1), 0.75)
    ),
    all(
      edgeTable.codeBlock().code(
        `0, 1
1, 2
2, 0`,
        0.75
      ),
      l3().end(1, 0.75),
      vertexTable.codeBlock().selection([lines(0), lines(2)], 0.75),
      edgeTable.codeBlock().selection(lines(2), 0.75)
    ),
    all(
      vertexTable.codeBlock().selection(DEFAULT, 0.75),
      edgeTable.codeBlock().selection(DEFAULT, 0.75)
    )
  );
  yield* waitUntil("Automatic");
  let cogImg = createRef<Img>();
  edgeTable
    .codeBackground()
    .add(
      <Img
        size={150}
        ref={cogImg}
        src={cog}
        scale={new Vector2(1, 1)}
        opacity={0}
      ></Img>
    );
  cogImg().scale(0);
  yield loop(() => cogImg().rotation(0).rotation(360, 2, linear));
  yield* all(
    edgeTable.codeBlock().scale(0, 1),
    cogImg().opacity(1, 1),
    cogImg().scale(1, 1)
  );
  yield* waitUntil("Obstacle Table");
  yield* all(
    vertexTableText().text("Obstacle Table", 1),
    vertexTableText().position(new Vector2(0, 300), 1),
    vertexTable.codeBlock().code(
      `[
  [
    (0, 0),
    (1, 2),
    (2, 0)
  ]
]`,
      1
    )
  );
  yield* waitUntil("Consecutive");
  yield* chain(
    vertexTable.codeBlock().selection(lines(2, 3), 1),
    vertexTable.codeBlock().selection(lines(3, 4), 1),
    vertexTable.codeBlock().selection([lines(4), lines(2)], 1),
    vertexTable.codeBlock().selection(DEFAULT, 1)
  );
  yield* waitUntil("Inflation");
});
