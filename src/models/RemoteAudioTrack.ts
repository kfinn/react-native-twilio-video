import { TwilioVideo } from '../TwilioVideo';

export interface RemoteAudioTrackAttributes {
  sid: string;
  isPlaybackEnabled: boolean;
  isEnabled: boolean;
  name: string;
  state: string | null;
}

export default class RemoteAudioTrack implements RemoteAudioTrackAttributes {
  sid: string;
  isPlaybackEnabled: boolean;
  isEnabled: boolean;
  name: string;
  state: string | null;

  constructor({
    sid,
    isPlaybackEnabled,
    isEnabled,
    name,
    state,
  }: RemoteAudioTrackAttributes) {
    this.sid = sid;
    this.isPlaybackEnabled = isPlaybackEnabled;
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  }

  mergeRemoteAudioTrackAttributes = ({
    sid,
    isPlaybackEnabled,
    isEnabled,
    name,
    state,
  }: RemoteAudioTrackAttributes) => {
    this.sid = sid;
    this.isPlaybackEnabled = isPlaybackEnabled;
    this.isEnabled = isEnabled;
    this.name = name;
    this.state = state;
  };

  setIsPlaybackEnabled = async (isPlaybackEnabled: boolean): Promise<void> => {
    await TwilioVideo.updateRemoteAudioTrack(this.sid, { isPlaybackEnabled });
    this.isPlaybackEnabled = isPlaybackEnabled;
  };
}
