import { CameraView } from "@ksassnowski/motion-canvas-camera";
import { Grid, makeScene2D } from "@motion-canvas/2d";
import {
  Direction,
  createRef,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";

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
  yield* slideTransition(Direction.Bottom, 1);

  yield* waitFor(5);
});
