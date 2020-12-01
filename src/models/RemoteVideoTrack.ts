export interface RemoteVideoTrackAttributes {
  sid: string;
  isSwitchedOff: boolean;
  priority: string | null;
  isEnabled: boolean;
  name: string;
  state: string | null;
}

export default class RemoteVideoTrack implements RemoteVideoTrackAttributes {
  sid: string;
  isSwitchedOff: boolean;
  priority: string | null;
  isEnabled: boolean;
  name: string;
  state: string | null;

  constructor({
    sid,
    isSwitchedOff,
    priority,
    isEnabled,
    name,
    state,
  }: RemoteVideoTrackAttributes) {
    this.sid = sid;
    this.isSwitchedOff = isSwitchedOff;
    this.priority = priority;
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  }

  mergeRemoteVideoTrackAttributes = ({
    sid,
    isSwitchedOff,
    priority,
    isEnabled,
    name,
    state,
  }: RemoteVideoTrackAttributes) => {
    this.sid = sid;
    this.isSwitchedOff = isSwitchedOff;
    this.priority = priority;
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  };
}
