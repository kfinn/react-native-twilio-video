import type { RemoteVideoTrackAttributes } from './RemoteVideoTrack';
import RemoteVideoTrack from './RemoteVideoTrack';

export interface RemoteVideoTrackPublicationAttributes {
  isTrackSubscribed: boolean;
  remoteTrack: RemoteVideoTrackAttributes | null;
  publishPriority: string;
  isTrackEnabled: boolean;
  trackName: string;
  trackSid: string;
}

export default class RemoteVideoTrackPublication
  implements RemoteVideoTrackPublicationAttributes {
  isTrackSubscribed: boolean;
  remoteTrack: RemoteVideoTrack | null;
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
  }: RemoteVideoTrackPublicationAttributes) {
    this.isTrackSubscribed = isTrackSubscribed;
    if (remoteTrack) {
      this.remoteTrack = new RemoteVideoTrack(remoteTrack);
    } else {
      this.remoteTrack = null;
    }
    this.publishPriority = publishPriority;
    this.isTrackEnabled = isTrackEnabled;
    this.trackName = trackName;
    this.trackSid = trackSid;
  }

  mergeRemoteVideoTrackPublicationAttributes = ({
    isTrackSubscribed,
    remoteTrack,
    publishPriority,
    isTrackEnabled,
    trackName,
    trackSid,
  }: RemoteVideoTrackPublicationAttributes) => {
    this.isTrackSubscribed = isTrackSubscribed;
    this.publishPriority = publishPriority;
    this.isTrackEnabled = isTrackEnabled;
    this.trackName = trackName;
    this.trackSid = trackSid;

    if (this.remoteTrack && remoteTrack) {
      if (remoteTrack) {
        this.remoteTrack.mergeRemoteVideoTrackAttributes(remoteTrack);
      } else {
        this.remoteTrack = null;
      }
    } else {
      if (remoteTrack) {
        this.remoteTrack = new RemoteVideoTrack(remoteTrack);
      }
    }
  };

  destroy = () => {};
}
