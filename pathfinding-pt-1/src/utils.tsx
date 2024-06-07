import {
  Circle,
  Code,
  Line,
  Node,
  PossibleCanvasStyle,
  Rect,
  Shape,
  Spline,
  LezerHighlighter,
  Txt,
} from "@motion-canvas/2d";
import {
  Reference,
  SignalValue,
  SimpleSignal,
  TimingFunction,
  Vector2,
  all,
  createRef,
  createSignal,
  easeInOutCubic,
} from "@motion-canvas/core";
import { MainColors } from "./styles";
import { parser as rustParser } from "@lezer/rust";
import { parser as javaParser } from "@lezer/java";
import { parser as javascriptParser } from "@lezer/javascript";
import { MaterialPalenightHighlightStyle } from "@hhenrichsen/canvas-commons/src/highlightstyle/MaterialPaleNight";

const JavaHighlighter = new LezerHighlighter(
  javaParser,
  MaterialPalenightHighlightStyle
);
export const languageHighlighters = {
  rust: new LezerHighlighter(rustParser, MaterialPalenightHighlightStyle),
  java: JavaHighlighter,
  javascript: new LezerHighlighter(
    javascriptParser,
    MaterialPalenightHighlightStyle
  ),
};

type PossibleHighlighter = keyof typeof languageHighlighters;

Code.defaultHighlighter = JavaHighlighter;

export function drawPoint(
  view: Node,
  position: Vector2,
  radius: SignalValue<number>,
  color: SignalValue<PossibleCanvasStyle>,
  borderWidth: SignalValue<number> = 0,
  borderColor: SignalValue<PossibleCanvasStyle> = MainColors.border
) {
  let ref = createRef<Circle>();

  view.add(
    <Circle
      ref={ref}
      x={position.x}
      y={position.y}
      width={radius}
      height={radius}
      fill={color}
      layout={false}
      stroke={borderColor}
      lineWidth={borderWidth}
    />
  );

  return ref;
}

export function drawPoints(
  view: Node,
  positions: Vector2[],
  radius: SignalValue<number>,
  color: SignalValue<PossibleCanvasStyle>
) {
  return positions.map((position) => drawPoint(view, position, radius, color));
}

export function drawLine(
  view: Node,
  positions: Vector2[],
  thickness: SignalValue<number>,
  color: SignalValue<PossibleCanvasStyle>,
  closed: boolean = false,
  startArrow: boolean = false,
  endArrow: boolean = false
) {
  if (closed) {
    positions.push(positions[0]);
  }
  let ref = createRef<Line>();
  view.add(
    <Line
      ref={ref}
      lineWidth={thickness}
      stroke={color}
      points={positions}
      startArrow={startArrow}
      endArrow={endArrow}
      layout={false}
    />
  );
  return ref;
}

export function drawLines(
  view: Node,
  positions: Vector2[],
  thickness: SignalValue<number>,
  color: SignalValue<PossibleCanvasStyle>,
  startArrow: boolean = false,
  endArrow: boolean = false
) {
  let lines = [];
  let splitPositions = [];
  for (let i = 0; i < positions.length; i += 2) {
    splitPositions.push(positions.slice(i, i + 2));
  }

  for (let line of splitPositions) {
    lines.push(
      drawLine(view, line, thickness, color, closed, startArrow, endArrow)
    );
  }

  return lines;
}

export function drawRect(
  view: Node,
  position: Vector2,
  width: SignalValue<number>,
  height: SignalValue<number>,
  color: SignalValue<PossibleCanvasStyle>,
  borderWidth: SignalValue<number> = 0,
  borderRadius: SignalValue<number> = 0,
  borderColor: SignalValue<PossibleCanvasStyle> = MainColors.border,
  rotation: SignalValue<number> = 0
) {
  let ref = createRef<Rect>();
  view.add(
    <Rect
      ref={ref}
      lineWidth={borderWidth}
      fill={color}
      width={width}
      height={height}
      x={position.x}
      y={position.y}
      stroke={borderColor}
      radius={borderRadius}
      layout={false}
      rotation={rotation}
    />
  );
  return ref;
}

export function drawRects(
  view: Node,
  positions: Vector2[],
  width: SignalValue<number>,
  height: SignalValue<number>,
  color: SignalValue<PossibleCanvasStyle>,
  borderWidth: SignalValue<number> = 0,
  borderRadius: SignalValue<number> = 0,
  borderColor: SignalValue<PossibleCanvasStyle> = MainColors.border
) {
  let rects = [];
  for (let position of positions) {
    rects.push(
      drawRect(
        view,
        position,
        width,
        height,
        color,
        borderWidth,
        borderRadius,
        borderColor
      )
    );
  }
  return rects;
}
export function drawSpline(
  view: Node,
  positions: Vector2[],
  thickness: SignalValue<number>,
  color: SignalValue<PossibleCanvasStyle>,
  closed: boolean = false,
  startArrow: boolean = false,
  endArrow: boolean = false
) {
  if (closed) {
    positions.push(positions[0]);
  }
  let ref = createRef<Spline>();
  view.add(
    <Spline
      ref={ref}
      lineWidth={thickness}
      stroke={color}
      startArrow={startArrow}
      endArrow={endArrow}
      layout={false}
      points={positions}
    />
  );
  return ref;
}

export class Robot {
  wheels: Reference<Shape>[];
  body: Reference<Shape>;
  attatchment: Reference<Shape> | null = null;
  private bodyWidth: number;
  private bodyHeight: number;
  private attatchmentWidth: number;
  private attatchmentHeight: number;
  private wheelWidth: number;
  private wheelHeight: number;
  private dimensionsSaved: boolean = false;

  constructor(wheels: Reference<Shape>[], body: Reference<Shape>) {
    this.wheels = wheels;
    this.body = body;
  }

  setAttatchment(attatchment: Reference<Shape>) {
    this.attatchment = attatchment;
  }

  saveDimensions() {
    this.bodyWidth = this.body().width();
    this.bodyHeight = this.body().height();
    this.attatchmentWidth = this.attatchment().width();
    this.attatchmentHeight = this.attatchment().height();
    this.wheelWidth = this.wheels[0]().width();
    this.wheelHeight = this.wheels[0]().height();
    this.dimensionsSaved = true;
  }

  animateIn(duration: number, timingFunction: TimingFunction = easeInOutCubic) {
    if (!this.dimensionsSaved) this.saveDimensions();
    this.body().width(0).height(0);
    this.attatchment().width(0).height(0);
    this.wheels.forEach((wheel) => wheel().width(0).height(0));

    return all(
      this.body().width(this.bodyWidth, duration, timingFunction),
      this.body().height(this.bodyHeight, duration, timingFunction),
      this.attatchment().width(this.attatchmentWidth, duration, timingFunction),
      this.attatchment().height(
        this.attatchmentHeight,
        duration,
        timingFunction
      ),
      ...this.wheels.map((wheel) =>
        wheel().width(this.wheelWidth, duration, timingFunction)
      ),
      ...this.wheels.map((wheel) =>
        wheel().height(this.wheelHeight, duration, timingFunction)
      )
    );
  }

  animateOut(
    duration: number,
    timingFunction: TimingFunction = easeInOutCubic
  ) {
    return all(
      this.body().width(0, duration, timingFunction),
      this.body().height(0, duration, timingFunction),
      this.attatchment().width(0, duration, timingFunction),
      this.attatchment().height(0, duration, timingFunction),
      ...this.wheels.map((wheel) => wheel().width(0, duration, timingFunction)),
      ...this.wheels.map((wheel) => wheel().height(0, duration, timingFunction))
    );
  }

  static dozer(view: Node, position: Vector2, scale: number) {
    let robot = drawRect(
      view,
      position,
      0.8 * scale,
      scale,
      MainColors.dozer.body,
      0,
      0.06 * scale
    );
    robot().zIndex(100);
    let plow = drawRect(
      robot(),
      new Vector2(0, -0.55 * scale),
      0.9 * scale,
      0.1 * scale,
      MainColors.dozer.wheels,
      0,
      0
    );
    let wheelPositions = [
      new Vector2(-0.42 * scale, 0.3 * scale),
      new Vector2(-0.42 * scale, 0),
      new Vector2(-0.42 * scale, -0.3 * scale),
      new Vector2(0.42 * scale, 0.3 * scale),
      new Vector2(0.42 * scale, 0),
      new Vector2(0.42 * scale, -0.3 * scale),
    ];
    let wheels = drawRects(
      robot(),
      wheelPositions,
      0.08 * scale,
      0.27 * scale,
      MainColors.dozer.wheels,
      0,
      0.06 * scale
    );
    let robotRef = new Robot(wheels, robot);
    robotRef.setAttatchment(plow);
    return robotRef;
  }
}

export class VisualVector {
  x: SimpleSignal<number, void>;
  y: SimpleSignal<number, void>;
  thickness: number;
  pointThickness: number;
  line: Reference<Line>;
  point: Reference<Circle>;

  constructor(
    x: number,
    y: number,
    thickness: number = 6,
    pointThickness: number = 3
  ) {
    this.x = createSignal(x);
    this.y = createSignal(y);
    this.thickness = thickness;
    this.pointThickness = pointThickness ?? thickness * 3.5;
  }

  static fromSignals(
    x: SimpleSignal<number>,
    y: SimpleSignal<number>,
    thickness: number = 6,
    pointThickness: number = 3
  ) {
    let vec = new VisualVector(0, 0, thickness, pointThickness);
    vec.x = x;
    vec.y = y;
    return vec;
  }

  draw(view: Node, position: Vector2, color: SignalValue<PossibleCanvasStyle>) {
    this.point = drawPoint(view, position, this.pointThickness, color);
    this.line = createRef<Line>();
    this.point().add(
      <Line
        ref={this.line}
        points={() => [new Vector2(0, 0), new Vector2(this.x(), this.y())]}
        lineWidth={this.thickness}
        stroke={color}
        layout={false}
        endArrow={true}
      />
    );
    this.point().zIndex(100);
    this.line().arrowSize(3 * this.thickness);
  }

  pointOnTop(view: Node) {
    this.point().removeChildren();
    this.line().add(this.point());
    this.line().position(this.point().position());
    this.point().position(new Vector2(0, 0));
    view.add(this.line());
  }

  lineOnTop(view: Node) {
    this.line().removeChildren();
    this.point().add(this.line());
    this.point().position(this.line().position());
    this.line().position(new Vector2(0, 0));
    view.add(this.point());
  }

  animateIn(
    view: Node,
    position: Vector2,
    color: SignalValue<PossibleCanvasStyle>,
    duration: number = 1,
    timingFunction: TimingFunction = easeInOutCubic,
    zIndex: number = 0
  ) {
    this.draw(view, position, color);
    this.point().size(0).zIndex(zIndex);
    this.line().end(0);
    return all(
      this.point().size(this.pointThickness, duration, timingFunction),
      this.line().end(1, duration, timingFunction)
    );
  }

  animateOut(
    duration: number = 1,
    timingFunction: TimingFunction = easeInOutCubic
  ) {
    return all(
      this.point().size(0, duration, timingFunction),
      this.line().end(0, duration, timingFunction)
    );
  }

  normalize(
    fieldScale: number,
    duration: number = 1,
    timingFunction: TimingFunction = easeInOutCubic
  ) {
    let x = this.x();
    let y = this.y();
    let magnitude = Math.sqrt(x ** 2 + y ** 2);
    return all(
      this.x((x / magnitude) * fieldScale, duration, timingFunction),
      this.y((y / magnitude) * fieldScale, duration, timingFunction)
    );
  }
}

export function drawDefinition(
  view: Node,
  position: Vector2,
  title: SignalValue<string>,
  description: SignalValue<string>,
  titleFontSize: number = 60,
  descriptionFontSize: number = 36
) {
  let bg = createRef<Rect>();
  let titleText = createRef<Txt>();
  let descriptionText = createRef<Txt>();
  view.add(
    <Rect
      layout
      ref={bg}
      x={position.x}
      y={position.y}
      fill={MainColors.codeBackground}
      radius={15}
      shadowBlur={3}
      shadowColor={MainColors.shadow}
      shadowOffsetX={3}
      shadowOffsetY={3}
      direction={"column"}
      padding={40}
      gap={45}
    />
  );
  bg().add(
    <Txt
      ref={titleText}
      x={25}
      y={25}
      text={title}
      fontSize={titleFontSize}
      fill={MainColors.text}
    />
  );
  bg().add(
    <Txt
      ref={descriptionText}
      x={25}
      y={() => titleText().height() + 25}
      text={description}
      fontSize={descriptionFontSize}
      fill={MainColors.text.darken(1.5)}
    />
  );
  return { bg, titleText, descriptionText };
}

export function drawCode(
  view: Node,
  position: Vector2,
  code: SignalValue<string>,
  language: PossibleHighlighter = "java",
  fontSize: number = 48
) {
  let codeBlock = createRef<Code>();
  <Code
    ref={codeBlock}
    code={code}
    fontSize={fontSize}
    highlighter={languageHighlighters[language]}
  />;
  let codeBackground = createRef<Rect>();
  view.add(
    <Rect
      ref={codeBackground}
      x={position.x}
      y={position.y}
      width={() => codeBlock().width() + 50}
      height={() => codeBlock().height() + 50}
      fill={MainColors.codeBackground}
      radius={15}
      shadowBlur={3}
      shadowColor={MainColors.shadow}
      shadowOffsetX={3}
      shadowOffsetY={3}
    />
  );
  codeBackground().add(codeBlock());

  return { codeBlock, codeBackground };
}
