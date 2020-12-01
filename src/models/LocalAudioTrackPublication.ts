import type { LocalAudioTrackAttributes } from './LocalAudioTrack';
import LocalAudioTrack from './LocalAudioTrack';

export interface LocalAudioTrackPublicationAttributes {
  trackSid: string;
  trackName: string;
  priority: string | null;
  localTrack: LocalAudioTrackAttributes | null;
}

export default class LocalAudioTrackPublication
  implements LocalAudioTrackPublicationAttributes {
  trackSid: string;
  trackName: string;
  priority: string | null;
  localTrack: LocalAudioTrack | null;

  constructor({
    trackSid,
    trackName,
    priority,
    localTrack,
  }: LocalAudioTrackPublicationAttributes) {
    this.trackSid = trackSid;
    this.trackName = trackName;
    this.priority = priority;
    if (localTrack) {
      this.localTrack = new LocalAudioTrack(localTrack);
    } else {
      this.localTrack = null;
    }
  }

  mergeLocalAudioTrackPublicationAttributes = ({
    trackSid,
    trackName,
    priority,
    localTrack,
  }: LocalAudioTrackPublicationAttributes) => {
    this.trackSid = trackSid;
    this.trackName = trackName;
    this.priority = priority;

    if (this.localTrack && localTrack) {
      if (localTrack) {
        this.localTrack.mergeLocalAudioTrackAttributes(localTrack);
      } else {
        this.localTrack = null;
      }
    } else {
      if (localTrack) {
        this.localTrack = new LocalAudioTrack(localTrack);
      }
    }
  };

  destroy = () => {};
}
