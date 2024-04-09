import { makeProject } from "@motion-canvas/core";

import intro from "./scenes/intro?scene";
import overview from "./scenes/overview?scene";
import setup from "./scenes/setup?scene";

import voiceover from "../resources/voiceover.wav";

import "./font.css";
import obstacles from "./scenes/obstacles?scene";
// import logo from "./assets/logo?scene";
// import icon from "./assets/icon?scene";
// import compactLogo from "./assets/compactLogo?scene";
import inflation from "./scenes/inflation?scene";

export default makeProject({
  scenes: [intro, overview, setup, obstacles, inflation],
  audio: voiceover,
});
