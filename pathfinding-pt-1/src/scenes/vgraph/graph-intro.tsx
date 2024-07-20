import { Circle, Img, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  createRef,
  Direction,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import Overview from "../../../resources/overview.png";
import { MainColors } from "../../styles";

export default makeScene2D(function* (view) {
  yield* slideTransition(Direction.Right, 1);

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
  yield* waitUntil("Overview");
  yield* all(
    overview().width(view.width(), 0.75),
    overview().height(view.height(), 0.75),
    overview().opacity(1, 0.75)
  );
  yield* waitUntil("SecondStep");
  let stepTwoOutline = createRef<Circle>();
  overview().add(
    <Circle
      ref={stepTwoOutline}
      size={225}
      stroke={MainColors.path}
      lineWidth={10}
      x={-187.5}
      y={-50}
      end={0}
    />
  );
  yield* stepTwoOutline().end(1, 1);
  yield* waitUntil("overviewDismiss");
  yield* all(
    overview().x(-view.width() * 1, 1),
    stepTwoOutline().end(0, 0.75),
    overview().opacity(0, 1)
  );

  yield* waitFor(10);
});
