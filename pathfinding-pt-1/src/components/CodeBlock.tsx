import {
  Code,
  initial,
  PossibleCodeScope,
  Rect,
  RectProps,
  signal,
} from "@motion-canvas/2d";
import { createRef, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { MainColors } from "../styles";
import { languageHighlighters } from "../utils";

export interface CodeBlockProps extends RectProps {
  code: SignalValue<PossibleCodeScope>;
  fontSize?: SignalValue<number>;
  language?: SignalValue<keyof typeof languageHighlighters>;
}

export class CodeBlock extends Rect {
  @signal()
  public declare readonly code: SimpleSignal<PossibleCodeScope, this>;

  @signal()
  @initial(48)
  public declare readonly fontSize: SimpleSignal<number, this>;

  @signal()
  @initial("javascript")
  public declare readonly language: SimpleSignal<
    keyof typeof languageHighlighters,
    this
  >;

  public readonly codeBlock = createRef<Code>();

  public constructor(props: CodeBlockProps) {
    super(props);
    this.add(
      <Code
        ref={this.codeBlock}
        code={this.code}
        fontSize={this.fontSize}
        highlighter={languageHighlighters[this.language()]}
      />
    );

    this.width(() => this.codeBlock().width() + 50)
      .height(() => this.codeBlock().height() + 50)
      .fill(MainColors.codeBackground)
      .radius(15)
      .shadowBlur(3)
      .shadowColor(MainColors.shadow)
      .shadowOffset([3, 3]);
  }
}
