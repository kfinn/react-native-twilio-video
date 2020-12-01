export interface LocalDataTrackAttributes {
  isEnabled: boolean;
  name: string;
  state: string | null;
}

export default class LocalDataTrack implements LocalDataTrackAttributes {
  isEnabled: boolean;
  name: string;
  state: string | null;

  constructor({ isEnabled, name, state }: LocalDataTrackAttributes) {
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  }

  mergeLocalDataTrackAttributes = ({
    isEnabled,
    name,
    state,
  }: LocalDataTrackAttributes) => {
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  };
}
