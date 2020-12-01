import type { RemoteAudioTrackAttributes } from './RemoteAudioTrack';
import RemoteAudioTrack from './RemoteAudioTrack';

export interface RemoteAudioTrackPublicationAttributes {
  isTrackSubscribed: boolean;
  remoteTrack: RemoteAudioTrackAttributes | null;
  publishPriority: string;
  isTrackEnabled: boolean;
  trackName: string;
  trackSid: string;
}

export default class RemoteAudioTrackPublication
  implements RemoteAudioTrackPublicationAttributes {
  isTrackSubscribed: boolean;
  remoteTrack: RemoteAudioTrack | null;
  publishPriority: string;
  isTrackEnabled: boolean;
  trackName: string;
  trackSid: string;

  constructor({
    isTrackSubscribed,
    remoteTrack,
    publishPriority,
    isTrackEnabled,
    trackName,
    trackSid,
  }: RemoteAudioTrackPublicationAttributes) {
    this.isTrackSubscribed = isTrackSubscribed;
    if (remoteTrack) {
      this.remoteTrack = new RemoteAudioTrack(remoteTrack);
    } else {
      this.remoteTrack = null;
    }
    this.publishPriority = publishPriority;
    this.isTrackEnabled = isTrackEnabled;
    this.trackName = trackName;
    this.trackSid = trackSid;
  }

  mergeRemoteAudioTrackPublicationAttributes = ({
    isTrackSubscribed,
    remoteTrack,
    publishPriority,
    isTrackEnabled,
    trackName,
    trackSid,
  }: RemoteAudioTrackPublicationAttributes) => {
    this.isTrackSubscribed = isTrackSubscribed;
    this.publishPriority = publishPriority;
    this.isTrackEnabled = isTrackEnabled;
    this.trackName = trackName;
    this.trackSid = trackSid;

    if (this.remoteTrack && remoteTrack) {
      if (remoteTrack) {
        this.remoteTrack.mergeRemoteAudioTrackAttributes(remoteTrack);
      } else {
        this.remoteTrack = null;
      }
    } else {
      if (remoteTrack) {
        this.remoteTrack = new RemoteAudioTrack(remoteTrack);
      }
    }
  };

  destroy = () => {};
}
