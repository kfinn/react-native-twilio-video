import { TwilioVideo } from '../TwilioVideo';

export interface LocalVideoTrackCreateParams {
  source?: {
    enablePreview?: boolean;
  };
  enabled?: boolean;
  name?: string;
}

export interface LocalVideoTrackAttributes {
  isEnabled: boolean;
  name: string;
  state: string | null;
}

export default class LocalVideoTrack implements LocalVideoTrackAttributes {
  isEnabled: boolean;
  name: string;
  state: string | null;

  constructor({ isEnabled, name, state }: LocalVideoTrackAttributes) {
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  }

  static async create(
    params: LocalVideoTrackCreateParams = {}
  ): Promise<LocalVideoTrack> {
    const LocalVideoTrackAttributes = await TwilioVideo.createLocalVideoTrack(
      params
    );
    return new LocalVideoTrack(LocalVideoTrackAttributes);
  }

  mergeLocalVideoTrackAttributes = ({
    isEnabled,
    name,
    state,
  }: LocalVideoTrackAttributes) => {
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  };
}
