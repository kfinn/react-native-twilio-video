import type { RemoteDataTrackAttributes } from './RemoteDataTrack';
import RemoteDataTrack from './RemoteDataTrack';

export interface RemoteDataTrackPublicationAttributes {
  isTrackSubscribed: boolean;
  remoteTrack: RemoteDataTrackAttributes | null;
  publishPriority: string;
  isTrackEnabled: boolean;
  trackName: string;
  trackSid: string;
}

export default class RemoteDataTrackPublication
  implements RemoteDataTrackPublicationAttributes {
  isTrackSubscribed: boolean;
  remoteTrack: RemoteDataTrack | null;
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
  }: RemoteDataTrackPublicationAttributes) {
    this.isTrackSubscribed = isTrackSubscribed;
    if (remoteTrack) {
      this.remoteTrack = new RemoteDataTrack(remoteTrack);
    } else {
      this.remoteTrack = null;
    }
    this.publishPriority = publishPriority;
    this.isTrackEnabled = isTrackEnabled;
    this.trackName = trackName;
    this.trackSid = trackSid;
  }

  mergeRemoteDataTrackPublicationAttributes = ({
    isTrackSubscribed,
    remoteTrack,
    publishPriority,
    isTrackEnabled,
    trackName,
    trackSid,
  }: RemoteDataTrackPublicationAttributes) => {
    this.isTrackSubscribed = isTrackSubscribed;
    this.publishPriority = publishPriority;
    this.isTrackEnabled = isTrackEnabled;
    this.trackName = trackName;
    this.trackSid = trackSid;

    if (this.remoteTrack && remoteTrack) {
      if (remoteTrack) {
        this.remoteTrack.mergeRemoteDataTrackAttributes(remoteTrack);
      } else {
        this.remoteTrack = null;
      }
    } else {
      if (remoteTrack) {
        this.remoteTrack = new RemoteDataTrack(remoteTrack);
      }
    }
  };

  destroy = () => {};
}
