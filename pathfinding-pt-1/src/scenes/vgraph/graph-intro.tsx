import { Circle, Img, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  Direction,
  slideTransition,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import Overview from "../../../resources/overview.png";
import { Fonts, MainColors } from "../../styles";
import { DefinitionFeature } from "../../components/DefinitionFeature";

export default makeScene2D(function* (view) {
  yield* slideTransition(Direction.Right, 1);
  const fieldScale = 90;

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
  yield* waitUntil("visibilityGraph");
  let visibilityGraphTxt = createRef<Txt>();
  view.add(
    <Txt
      text={"Visibility Graph"}
      ref={visibilityGraphTxt}
      fontSize={50}
      y={600}
      fill={MainColors.text}
      fontFamily={Fonts.main}
    />
  );
  yield* all(
    visibilityGraphTxt().y(0, 1),
    visibilityGraphTxt().fontSize(120, 1)
  );
  yield* waitUntil("graph");
  yield all(
    visibilityGraphTxt().fontSize(80, 1),
    visibilityGraphTxt().y(-425, 1)
  );

  let graphDefinition = createRef<DefinitionFeature>();
  view.add(
    <DefinitionFeature
      ref={graphDefinition}
      word={"Graph"}
      definition={"A set of vertices and edges that connect them."}
      featureWidth={view.height() / 1.5}
      width={view.width()}
      height={view.height()}
      featureY={1000}
      pads={25}
    />
  );
  yield* graphDefinition().slideInVertical(1);
  yield* waitUntil("graphDismiss");
  yield* graphDefinition().slideOutVertical(1000, 1);

  let bg = createRef<Rect>();
  view.add(
    <Rect
      ref={bg}
      width={view.width()}
      height={view.height()}
      fill={"#000"}
      opacity={0}
    />
  );
  yield* waitUntil("obstacles");
  yield* bg().opacity(0.6, 1);
  let squareVertices = [
    new Vector2(-3 * fieldScale, -3 * fieldScale),
    new Vector2(3 * fieldScale, -3 * fieldScale),
    new Vector2(3 * fieldScale, 3 * fieldScale),
    new Vector2(-3 * fieldScale, 3 * fieldScale),
  ];
  yield* waitFor(10);
});
