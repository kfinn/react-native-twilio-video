import type { LocalVideoTrackAttributes } from './LocalVideoTrack';
import LocalVideoTrack from './LocalVideoTrack';

export interface LocalVideoTrackPublicationAttributes {
  trackSid: string;
  trackName: string;
  priority: string | null;
  localTrack: LocalVideoTrackAttributes | null;
}

export default class LocalVideoTrackPublication
  implements LocalVideoTrackPublicationAttributes {
  trackSid: string;
  trackName: string;
  priority: string | null;
  localTrack: LocalVideoTrack | null;

  constructor({
    trackSid,
    trackName,
    priority,
    localTrack,
  }: LocalVideoTrackPublicationAttributes) {
    this.trackSid = trackSid;
    this.trackName = trackName;
    this.priority = priority;
    if (localTrack) {
      this.localTrack = new LocalVideoTrack(localTrack);
    } else {
      this.localTrack = null;
    }
  }

  mergeLocalVideoTrackPublicationAttributes = ({
    trackSid,
    trackName,
    priority,
    localTrack,
  }: LocalVideoTrackPublicationAttributes) => {
    this.trackSid = trackSid;
    this.trackName = trackName;
    this.priority = priority;

    if (this.localTrack && localTrack) {
      if (localTrack) {
        this.localTrack.mergeLocalVideoTrackAttributes(localTrack);
      } else {
        this.localTrack = null;
      }
    } else {
      if (localTrack) {
        this.localTrack = new LocalVideoTrack(localTrack);
      }
    }
  };

  destroy = () => {};
}
