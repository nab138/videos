import {
  Img,
  Layout,
  Node,
  NodeProps,
  Rect,
  signal,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  chain,
  createRef,
  easeInCubic,
  easeOutCubic,
  Reference,
  SignalValue,
  SimpleSignal,
} from "@motion-canvas/core";
import { Fonts, MainColors } from "../styles";

export interface MusicCardProps extends NodeProps {
  title: SignalValue<string>;
  artist: SignalValue<string>;
  cover: SignalValue<string>;
}

export class MusicCard extends Node {
  @signal()
  public declare readonly title: SimpleSignal<string, this>;

  @signal()
  public declare readonly artist: SimpleSignal<string, this>;

  @signal()
  public declare readonly cover: SimpleSignal<string, this>;

  private readonly coverMask: Reference<Rect>;
  private readonly coverImg: Reference<Img>;
  private readonly titleTxt: Reference<Txt>;
  private readonly artistTxt: Reference<Txt>;

  public constructor(props: MusicCardProps) {
    super(props);
    let bg = createRef<Rect>();
    this.add(
      <Rect
        ref={bg}
        width={600}
        height={150}
        fill={MainColors.backgroundDarkSecondary}
        stroke="black"
        layout
        padding={5}
        alignItems={"center"}
        gap={25}
      />
    );
    this.coverImg = createRef<Img>();
    bg().add(
      <Img
        ref={this.coverImg}
        width={140}
        height={140}
        src={this.cover}
        layout
        justifyContent={"end"}
        radius={8}
      />
    );
    this.coverMask = createRef<Rect>();
    this.coverImg().add(
      <Rect
        ref={this.coverMask}
        width={140}
        height={140}
        fill={MainColors.backgroundDarkSecondary}
      />
    );
    let textLayout = createRef<Layout>();
    bg().add(
      <Layout
        ref={textLayout}
        width={400}
        height={130}
        layout
        direction="column"
        justifyContent={"center"}
        gap={5}
      />
    );
    this.titleTxt = createRef<Txt>();
    textLayout().add(
      <Txt
        fill={MainColors.text}
        fontSize={50}
        fontFamily={Fonts.main}
        ref={this.titleTxt}
      />
    );
    this.artistTxt = createRef<Txt>();
    textLayout().add(
      <Txt
        fill={MainColors.text}
        fontSize={30}
        fontFamily="Arial"
        ref={this.artistTxt}
      />
    );
  }

  public *animateIn(duration: number) {
    let dur = 0.5 * duration;
    yield* chain(
      this.coverMask().width(0, dur, easeInCubic),
      all(
        this.titleTxt().text(this.title() + " ♪", dur, easeOutCubic),
        this.artistTxt().text(this.artist(), dur, easeOutCubic)
      )
    );
  }

  public *animateOut(duration: number) {
    let dur = 0.5 * duration;
    yield* chain(
      all(
        this.titleTxt().text("ㅤ", dur, easeInCubic),
        this.artistTxt().text("ㅤ", dur, easeInCubic)
      ),
      this.coverMask().width(140, dur, easeOutCubic)
    );
  }
}
