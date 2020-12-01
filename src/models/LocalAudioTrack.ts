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
