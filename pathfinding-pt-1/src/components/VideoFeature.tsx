import { signal, Video } from "@motion-canvas/2d";
import {
  createRef,
  Reference,
  SignalValue,
  SimpleSignal,
} from "@motion-canvas/core";
import { Feature, FeatureProps } from "./Feature";

export interface VideoFeatureProps extends FeatureProps {
  videoSource: SignalValue<string>;
  text: SignalValue<string>;
  videoWidth: SignalValue<number>;
  videoHeight: SignalValue<number>;
}

export class VideoFeature extends Feature {
  @signal()
  public declare readonly videoSource: SimpleSignal<string, this>;

  @signal()
  public declare readonly text: SimpleSignal<string, this>;

  @signal()
  public declare readonly videoWidth: SimpleSignal<number, this>;

  @signal()
  public declare readonly videoHeight: SimpleSignal<number, this>;

  private readonly video: Reference<Video>;

  public constructor(props: VideoFeatureProps) {
    super(props);
    this.video = createRef<Video>();

    this.feature().width(this.videoWidth() + this.pads() * 2);
    this.txt().text(this.text);

    this.feature().add(
      <Video
        ref={this.video}
        src={this.videoSource()}
        radius={5}
        width={this.videoWidth()}
        height={this.videoHeight()}
      />
    );
  }

  public play() {
    this.video().play();
  }

  public pause() {
    this.video().pause();
  }
}
