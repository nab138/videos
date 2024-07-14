import { Camera, Grid, makeScene2D } from "@motion-canvas/2d";
import {
  createRef,
  Direction,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";

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

  camera().scene().position(view.size().div(2));
  yield* slideTransition(Direction.Bottom, 1);
  yield* waitFor(50);
});
