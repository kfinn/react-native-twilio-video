export interface RemoteDataTrackAttributes {
  sid: string;
  isEnabled: boolean;
  name: string;
  state: string | null;
}

export default class RemoteDataTrack implements RemoteDataTrackAttributes {
  sid: string;
  isEnabled: boolean;
  name: string;
  state: string | null;

  constructor({ sid, isEnabled, name, state }: RemoteDataTrackAttributes) {
    this.sid = sid;
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  }

  mergeRemoteDataTrackAttributes = ({
    sid,
    isEnabled,
    name,
    state,
  }: RemoteDataTrackAttributes) => {
    this.sid = sid;
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  };
}
