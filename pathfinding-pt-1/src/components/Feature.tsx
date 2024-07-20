import { Img, initial, Rect, RectProps, signal, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  Reference,
  SignalValue,
  SimpleSignal,
} from "@motion-canvas/core";
import { Fonts, MainColors } from "../styles";

export interface FeatureProps extends RectProps {
  pads?: SignalValue<number>;
  featureWidth?: SignalValue<number>;
  featureY?: SignalValue<number>;
  featureX?: SignalValue<number>;
  bgOpacity?: SignalValue<number>;
  txtSize?: SignalValue<number>;
}

export abstract class Feature extends Rect {
  @initial(15)
  @signal()
  public declare readonly pads: SimpleSignal<number, this>;

  @initial(200)
  @signal()
  public declare readonly featureWidth: SimpleSignal<number, this>;

  @initial(0)
  @signal()
  public declare readonly featureX: SimpleSignal<number, this>;

  @initial(0)
  @signal()
  public declare readonly featureY: SimpleSignal<number, this>;

  @initial(0)
  @signal()
  public declare readonly bgOpacity: SimpleSignal<number, this>;

  @initial(26)
  @signal()
  public declare readonly txtSize: SimpleSignal<number, this>;

  public readonly feature: Reference<Rect>;
  protected readonly txt: Reference<Txt>;
  protected readonly bg: Reference<Rect>;

  public constructor(props: FeatureProps) {
    super(props);
    this.feature = createRef<Rect>();
    this.txt = createRef<Txt>();
    this.bg = createRef<Rect>();

    this.add(
      <Rect
        ref={this.bg}
        fill={"#000"}
        opacity={this.bgOpacity}
        width={this.width()}
        height={this.height()}
      />
    );

    this.add(
      <Rect
        zIndex={1}
        ref={this.feature}
        fill={MainColors.backgroundDarkSecondary}
        radius={15}
        shadowBlur={3}
        shadowColor={MainColors.shadow}
        shadowOffset={[3, 3]}
        layout
        direction={"column"}
        gap={this.pads() / 2}
        padding={this.pads()}
        width={this.featureWidth()}
        x={this.featureX}
        y={this.featureY}
      />
    );

    this.feature().add(
      <Txt
        ref={this.txt}
        fontFamily={Fonts.code}
        fill={MainColors.textSecondary}
        fontSize={this.txtSize}
        textAlign={"left"}
      />
    );
  }

  public *slideInVertical(duration: number) {
    yield* all(this.featureY(0, duration), this.bgOpacity(0.6, 1));
  }

  public *slideOutVertical(targetY: number, duration: number) {
    yield* all(this.featureY(targetY, duration), this.bgOpacity(0, 1));
  }
}
