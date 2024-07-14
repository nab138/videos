import { Color } from "@motion-canvas/core";

export class MainColors {
  static backgroundLight = new Color(new Color("#e0e0e0"));
  static backgroundDark = new Color("#0d0d0d");
  static backgroundDarkSecondary = this.backgroundDark.brighten(0.8);
  static backgroundDarkTertiary = this.backgroundDark.brighten(1.5);
  static interactionArea = new Color("#525252");
  static obstacles = new Color("#f7ba4f");
  static path = new Color("#f55b53");
  static text = new Color("#fafafa");
  static border = new Color("#454545");
  static shadow = new Color("#2e2e2e");
  static dozer = {
    body: new Color("#363ceb"),
    wheels: new Color("#2d2d2e"),
    wheels3D: new Color("#3d3d3e"),
  };
  static blue = new Color("#363ceb");

  static codeBackground = new Color("#151515");
}

export class TeamColors {
  static purple = new Color("#6b2686");
  static purpleDark = new Color("#3d2c59");
  static gold = new Color("#f89a1c");
  static yellow = new Color("#fede00");
}

export class Fonts {
  static main = "Poppins";
  static team = "Audiowide";
}
