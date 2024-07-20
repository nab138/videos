import { Img, signal } from "@motion-canvas/2d";
import { Reference, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { Feature, FeatureProps } from "./Feature";

export interface ImageFeatureProps extends FeatureProps {
  image: SignalValue<string>;
  name: SignalValue<string>;
}

export class ImageFeature extends Feature {
  @signal()
  public declare readonly image: SimpleSignal<string, this>;

  @signal()
  public declare readonly name: SimpleSignal<string, this>;

  private readonly img: Reference<Img>;

  public constructor(props: ImageFeatureProps) {
    super(props);

    this.feature().height(this.featureWidth() + this.txtSize() + this.pads());
    this.txt().text("Image ⋅ " + this.name());
    let dim;
    let width = this.featureWidth() - this.pads();

    let height = this.feature().height() - this.txt().height() - this.pads();
    dim = Math.min(width, height);
    this.feature().add(
      <Img
        ref={this.img}
        src={this.image()}
        width={dim - this.pads()}
        height={dim - this.pads()}
        radius={10}
      />
    );
  }
}
