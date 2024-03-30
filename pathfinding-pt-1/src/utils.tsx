import {
  Circle,
  Line,
  Node,
  PossibleCanvasStyle,
  Rect,
  Shape,
  Spline,
} from "@motion-canvas/2d";
import {
  PossibleVector2,
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
import Colors from "./colors";
import { CodeBlock } from "@motion-canvas/2d/lib/components/CodeBlock";

export function drawPoint(
  view: Node,
  position: Vector2,
  radius: SignalValue<number>,
  color: SignalValue<PossibleCanvasStyle>,
  borderWidth: SignalValue<number> = 0,
  borderColor: SignalValue<PossibleCanvasStyle> = Colors.border
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
  borderColor: SignalValue<PossibleCanvasStyle> = Colors.border,
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
  borderColor: SignalValue<PossibleCanvasStyle> = Colors.border
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

  constructor(wheels: Reference<Shape>[], body: Reference<Shape>) {
    this.wheels = wheels;
    this.body = body;
  }

  setAttatchment(attatchment: Reference<Shape>) {
    this.attatchment = attatchment;
  }

  animateIn(duration: number, timingFunction: TimingFunction = easeInOutCubic) {
    let bodyWidth = this.body().width();
    let bodyHeight = this.body().height();
    let attatchmentWidth = this.attatchment().width();
    let attatchmentHeight = this.attatchment().height();
    let wheelWidth = this.wheels[0]().width();
    let wheelHeight = this.wheels[0]().height();

    this.body().width(0).height(0);
    this.attatchment().width(0).height(0);
    this.wheels.forEach((wheel) => wheel().width(0).height(0));

    return all(
      this.body().width(bodyWidth, duration, timingFunction),
      this.body().height(bodyHeight, duration, timingFunction),
      this.attatchment().width(attatchmentWidth, duration, timingFunction),
      this.attatchment().height(attatchmentHeight, duration, timingFunction),
      ...this.wheels.map((wheel) =>
        wheel().width(wheelWidth, duration, timingFunction)
      ),
      ...this.wheels.map((wheel) =>
        wheel().height(wheelHeight, duration, timingFunction)
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
      Colors.dozer.body,
      0,
      5
    );
    robot().zIndex(100);
    let plow = drawRect(
      robot(),
      new Vector2(0, -0.55 * scale),
      0.9 * scale,
      0.1 * scale,
      Colors.dozer.wheels,
      1,
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
      Colors.dozer.wheels,
      0,
      5
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
  line: Reference<Line>;
  point: Reference<Circle>;

  constructor(x: number, y: number, thickness: number = 6) {
    this.x = createSignal(x);
    this.y = createSignal(y);
    this.thickness = thickness;
  }

  draw(view: Node, position: Vector2, color: SignalValue<PossibleCanvasStyle>) {
    this.point = drawPoint(view, position, 4 * this.thickness, color);
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

  animateIn(
    view: Node,
    position: Vector2,
    color: SignalValue<PossibleCanvasStyle>,
    duration: number = 1,
    timingFunction: TimingFunction = easeInOutCubic
  ) {
    this.draw(view, position, color);
    this.point().size(0);
    this.line().end(0);
    return all(
      this.point().size(4 * this.thickness, duration, timingFunction),
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
}

export function drawCode(
  view: Node,
  position: Vector2,
  code: SignalValue<string>,
  language: string = "java",
  fontSize: number = 48
) {
  let codeBlock = createRef<CodeBlock>();
  <CodeBlock
    ref={codeBlock}
    code={code}
    language={language}
    fontSize={fontSize}
  />;
  let codeBackground = createRef<Rect>();
  view.add(
    <Rect
      ref={codeBackground}
      x={position.x}
      y={position.y}
      width={() => codeBlock().width() + 50}
      height={() => codeBlock().height() + 50}
      fill={Colors.codeBackground}
      radius={15}
      shadowBlur={3}
      shadowColor={Colors.shadow}
      shadowOffsetX={3}
      shadowOffsetY={3}
    />
  );
  codeBackground().add(codeBlock());

  return { codeBlock, codeBackground };
}
