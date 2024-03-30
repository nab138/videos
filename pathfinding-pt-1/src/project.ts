import { makeProject } from "@motion-canvas/core";

import drawObstacle from "./scenes/draw-obstacle?scene";
import intro from "./scenes/intro?scene";
import overview from "./scenes/overview?scene";
import setup from "./scenes/setup?scene";

import voiceover from "../resources/voiceover.wav";

import "./font.css";
import obstacles from "./scenes/obstacles?scene";
import threetest from "./scenes/threetest?scene";

export default makeProject({
  scenes: [intro, overview, setup, obstacles],
  audio: voiceover,
});
// export default makeProject({
//   scenes: [logo],
//   audio: voiceover,
// });

// export default makeProject({
//   scenes: [threetest],
//   audio: voiceover,
// });
