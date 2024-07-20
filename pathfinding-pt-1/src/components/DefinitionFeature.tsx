import { Img, initial, signal, Txt } from "@motion-canvas/2d";
import {
  createRef,
  Reference,
  SignalValue,
  SimpleSignal,
} from "@motion-canvas/core";
import { Feature, FeatureProps } from "./Feature";
import { Fonts, MainColors } from "../styles";

export interface DefinitionFeatureProps extends FeatureProps {
  word: SignalValue<string>;
  definition: SignalValue<string>;
  definitionSize?: SignalValue<number>;
  termSize?: SignalValue<number>;
}

export class DefinitionFeature extends Feature {
  @signal()
  public declare readonly definition: SimpleSignal<string, this>;

  @signal()
  public declare readonly word: SimpleSignal<string, this>;

  @initial(48)
  @signal()
  public declare readonly definitionSize: SimpleSignal<number, this>;

  @initial(36)
  @signal()
  public declare readonly termSize: SimpleSignal<number, this>;

  private readonly definitionNode: Reference<Txt>;

  public constructor(props: DefinitionFeatureProps) {
    super(props);
    this.definitionNode = createRef<Txt>();
    this.txt().fontSize(this.termSize);

    this.txt().text("Definition ⋅ " + this.word());

    this.feature().add(
      <Txt
        fontSize={this.definitionSize()}
        ref={this.definitionNode}
        text={() => `"` + this.definition() + `"`}
        fontFamily={Fonts.main}
        fill={MainColors.text}
        maxWidth={this.featureWidth() - this.pads() * 2}
        textWrap={true}
      />
    );
  }
}
