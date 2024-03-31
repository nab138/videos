import { Txt, makeScene2D, Img } from "@motion-canvas/2d";
import { Robot, drawRect, drawSpline } from "../utils";
import { Vector2, waitUntil, createRef } from "@motion-canvas/core";
import Colors from "../colors";
import logo from "../../resources/teamlogo.png";
import "../font.css";

export default makeScene2D(function* (view) {
  let fieldScale = 600;
  let field = drawRect(
    view,
    new Vector2(0, 0),
    1024,
    1024,
    Colors.teamPurpleDark,
    5,
    50
  );

  let dozer = Robot.dozer(field(), new Vector2(0, 0), fieldScale);
  dozer.body().rotation(50);

  dozer
    .body()
    .add(
      <Img
        size={315}
        src={logo}
        scale={new Vector2(1, 1)}
        zIndex={9999999}
      ></Img>
    );

  // let obstacle = drawRect(
  //   field(),
  //   new Vector2(300, 0),
  //   100,
  //   300,
  //   Colors.obstacles,
  //   2,
  //   15
  // );

  let spline = drawSpline(
    field(),
    [
      new Vector2(150, -430),
      new Vector2(-150, -420),
      new Vector2(-250, -370),
      new Vector2(-370, -200),
      new Vector2(-370, 300),
      new Vector2(-300, 370),
      new Vector2(-250, 390),
      new Vector2(-200, 405),
      new Vector2(-50, 405),
      new Vector2(50, 250),
      new Vector2(100, 50),
    ],
    20,
    Colors.teamGold
  );
  spline().lineDash([40, 20]);
  dozer.body().position(spline().getPointAtPercentage(1).position),
    dozer
      .body()
      .rotation(spline().getPointAtPercentage(1).normal.degrees + 180);

  yield* waitUntil("introDone");
});
