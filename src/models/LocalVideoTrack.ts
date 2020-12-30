import { TwilioVideo } from '../TwilioVideo';

export interface LocalVideoTrackCreateParams {
  source?: {
    enablePreview?: boolean;
  };
  format?: {
    dimensions: {
      width: number;
      height: number;
    };
    framerate: number;
  };
  enabled?: boolean;
  name?: string;
  deviceId?: string;
}

export interface LocalVideoTrackAttributes {
  isEnabled: boolean;
  name: string;
  state: string | null;
}

export default class LocalVideoTrack implements LocalVideoTrackAttributes {
  isDestroyed = false;
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

  setIsEnabled = async (enabled: boolean): Promise<void> => {
    await TwilioVideo.updateLocalVideoTrack(this.name, { enabled });
    this.isEnabled = enabled;
  };

  async destroy(): Promise<void> {
    await TwilioVideo.destroyLocalVideoTrack(this.name);
    this.isDestroyed = true;
    return;
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
