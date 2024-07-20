import { makeProject } from "@motion-canvas/core";
import voiceover from "../resources/voiceover.wav";
import "./font.css";

import intro from "./scenes/intro/intro?scene";
import overview from "./scenes/intro/overview?scene";
import setup from "./scenes/intro/setup?scene";

import obstacles from "./scenes/obstacles/obstacles?scene";
import inflation from "./scenes/obstacles/inflation?scene";
import vectorIntersect from "./scenes/obstacles/vector-intersect?scene";
import cornerCutting from "./scenes/obstacles/corner-cutting?scene";

import graphIntro from "./scenes/vgraph/graph-intro?scene";

export default makeProject({
  scenes: [
    intro,
    overview,
    setup,
    obstacles,
    inflation,
    vectorIntersect,
    cornerCutting,
    graphIntro,
  ],
  audio: voiceover,
});
