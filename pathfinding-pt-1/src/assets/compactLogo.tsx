import { Txt, makeScene2D, Img, Rect } from "@motion-canvas/2d";
import { Robot, drawRect, drawSpline } from "../utils";
import { Vector2, waitUntil, createRef } from "@motion-canvas/core";
import Colors from "../colors";
import logo from "../../resources/Asset_1.svg";
import "../font.css";

export default makeScene2D(function* (view) {
  let bg = Colors.teamPurpleDark;
  let fieldScale = 85;
  let length = 13.6 * fieldScale;
  let height = 3 * fieldScale;
  let field = drawRect(view, new Vector2(0, 0), length, height, bg, 5, 15);

  let dozer = Robot.dozer(field(), new Vector2(-500, 200), fieldScale * 1.8);
  dozer.body().rotation(50);
  (dozer.body() as any).radius(0.5 * fieldScale);
  drawRect(
    dozer.body(),
    new Vector2(0, 0),
    0.9 * fieldScale,
    1.25 * fieldScale,
    bg,
    0,
    0.4 * fieldScale
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
  let text = createRef<Txt>();

  field().add(
    <Txt
      textAlign={"left"}
      ref={text}
      fill={Colors.text}
      fontFamily={Colors.teamFont}
      fontSize={190}
      alignContent={"center"}
      size={new Vector2(length, height)}
      position={new Vector2(160, -15)}
    >
      xplorer
    </Txt>
  );

  let spline = drawSpline(
    field(),
    [
      new Vector2(-495, -35),
      new Vector2(-495, -15),
      new Vector2(-475, 100),
      new Vector2(-350, 95),
      new Vector2(-300, 95),
      new Vector2(-250, 95),
      new Vector2(-150, 75),
      new Vector2(0, 75),
      new Vector2(300, 70),
      new Vector2(420, 5),
      new Vector2(475, -15),
    ],
    10,
    Colors.teamGold
  );
  spline().lineDash([20, 15]);
  dozer.body().position(new Vector2(-495, -25));
  dozer.body().rotation(180);

  field().add(
    <Img
      position={new Vector2(470, -15)}
      size={150}
      src={logo}
      scale={new Vector2(1, 1)}
    ></Img>
  );

  yield* waitUntil("introDone");
});
