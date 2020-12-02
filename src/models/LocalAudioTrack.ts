import { TwilioVideo } from '../TwilioVideo';

export interface LocalAudioTrackCreateParams {
  options?: {
    audioJitterBufferMaxPackets?: number;
    audioJitterBufferFastAccelerate?: boolean;
    softwareAecEnabled?: boolean;
    highpassFilter?: boolean;
  };
  enabled?: boolean;
  name?: string;
}

export interface LocalAudioTrackAttributes {
  isEnabled: boolean;
  name: string;
  state: string | null;
}

export default class LocalAudioTrack implements LocalAudioTrackAttributes {
  isEnabled: boolean;
  name: string;
  state: string | null;

  constructor({ isEnabled, name, state }: LocalAudioTrackAttributes) {
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  }

  static async create(
    params: LocalAudioTrackCreateParams = {}
  ): Promise<LocalAudioTrack> {
    const localAudioTrackAttributes = await TwilioVideo.createLocalAudioTrack(
      params
    );
    return new LocalAudioTrack(localAudioTrackAttributes);
  }

  mergeLocalAudioTrackAttributes = ({
    isEnabled,
    name,
    state,
  }: LocalAudioTrackAttributes) => {
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  };
}
