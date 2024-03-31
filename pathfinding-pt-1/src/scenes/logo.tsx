import { Txt, makeScene2D, Img } from "@motion-canvas/2d";
import { Robot, drawRect, drawSpline } from "../utils";
import { Vector2, waitUntil, createRef } from "@motion-canvas/core";
import Colors from "../colors";
import logo from "../../resources/teamlogo.png";
import "../font.css";

export default makeScene2D(function* (view) {
  let fieldScale = 85;
  let field = drawRect(
    view,
    new Vector2(0, 0),
    16 * fieldScale,
    4 * fieldScale,
    Colors.teamPurple,
    5,
    15
  );

  let dozer = Robot.dozer(field(), new Vector2(-500, 200), fieldScale * 1.2);
  dozer.body().rotation(50);

  // let obstacle = drawRect(
  //   field(),
  //   new Vector2(300, 0),
  //   100,
  //   300,
  //   Colors.obstacles,
  //   2,
  //   15
  // );
  let text = createRef<Txt>();

  field().add(
    <Txt
      ref={text}
      fill={Colors.text}
      fontFamily={Colors.teamFont}
      fontSize={190}
    >
      Oxplorer
    </Txt>
  );

  let spline = drawSpline(
    field(),
    [
      new Vector2(-580, -100),
      new Vector2(-565, 0),
      new Vector2(-515, 80),
      new Vector2(-400, 90),
      new Vector2(-300, 90),
      new Vector2(-250, 90),
      new Vector2(-150, 130),
      new Vector2(0, 90),
      new Vector2(450, 85),
      new Vector2(530, 10),
      new Vector2(550, 30),
    ],
    10,
    Colors.teamGold
  );
  spline().lineDash([20, 15]);
  dozer.body().position(spline().getPointAtPercentage(0.075).position),
    dozer
      .body()
      .rotation(spline().getPointAtPercentage(0.075).normal.degrees + 180);

  field().add(
    <Img
      position={new Vector2(575, 0)}
      size={150}
      src={logo}
      scale={new Vector2(1, 1)}
    ></Img>
  );

  yield* waitUntil("introDone");
});
