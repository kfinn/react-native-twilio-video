import type { LocalDataTrackAttributes } from './LocalDataTrack';
import LocalDataTrack from './LocalDataTrack';

export interface LocalDataTrackPublicationAttributes {
  trackSid: string;
  trackName: string;
  priority: string | null;
  localTrack: LocalDataTrackAttributes | null;
}

export default class LocalDataTrackPublication
  implements LocalDataTrackPublicationAttributes {
  trackSid: string;
  trackName: string;
  priority: string | null;
  localTrack: LocalDataTrack | null;

  constructor({
    trackSid,
    trackName,
    priority,
    localTrack,
  }: LocalDataTrackPublicationAttributes) {
    this.trackSid = trackSid;
    this.trackName = trackName;
    this.priority = priority;
    if (localTrack) {
      this.localTrack = new LocalDataTrack(localTrack);
    } else {
      this.localTrack = null;
    }
  }

  mergeLocalDataTrackPublicationAttributes = ({
    trackSid,
    trackName,
    priority,
    localTrack,
  }: LocalDataTrackPublicationAttributes) => {
    this.trackSid = trackSid;
    this.trackName = trackName;
    this.priority = priority;

    if (this.localTrack && localTrack) {
      if (localTrack) {
        this.localTrack.mergeLocalDataTrackAttributes(localTrack);
      } else {
        this.localTrack = null;
      }
    } else {
      if (localTrack) {
        this.localTrack = new LocalDataTrack(localTrack);
      }
    }
  };

  destroy = () => {};
}
