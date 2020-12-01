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
