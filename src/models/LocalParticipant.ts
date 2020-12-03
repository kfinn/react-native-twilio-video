import { TwilioVideo, TwilioVideoEventEmitter } from '../TwilioVideo';
import ListenersByEventType, { Listener } from './ListenersByEventType';
import type LocalAudioTrack from './LocalAudioTrack';
import type { LocalAudioTrackAttributes } from './LocalAudioTrack';
import type { LocalAudioTrackPublicationAttributes } from './LocalAudioTrackPublication';
import LocalAudioTrackPublication from './LocalAudioTrackPublication';
import type { LocalDataTrackAttributes } from './LocalDataTrack';
import type { LocalDataTrackPublicationAttributes } from './LocalDataTrackPublication';
import LocalDataTrackPublication from './LocalDataTrackPublication';
import type LocalVideoTrack from './LocalVideoTrack';
import type { LocalVideoTrackAttributes } from './LocalVideoTrack';
import type { LocalVideoTrackPublicationAttributes } from './LocalVideoTrackPublication';
import LocalVideoTrackPublication from './LocalVideoTrackPublication';
import type { SubscriptionsByEventType } from './Room';

type LocalParticipantEventType =
  | 'audioTrackPublicationFailed'
  | 'audioTrackPublished'
  | 'dataTrackPublicationFailed'
  | 'dataTrackPublished'
  | 'networkQualityLevelChanged'
  | 'videoTrackPublicationFailed'
  | 'videoTrackPublished';

export interface LocalParticipantAttributes {
  identity: string;
  sid: string | null;
  networkQualityLevel: string;
  localAudioTracks: LocalAudioTrackPublicationAttributes[];
  localVideoTracks: LocalVideoTrackPublicationAttributes[];
  localDataTracks: LocalDataTrackPublicationAttributes[];
}

interface LocalParticipantEventData {
  participant: LocalParticipantAttributes;
}

export default class LocalParticipant implements LocalParticipantAttributes {
  identity: string;
  sid: string | null;
  networkQualityLevel: string;
  localAudioTracks: LocalAudioTrackPublication[];
  localVideoTracks: LocalVideoTrackPublication[];
  localDataTracks: LocalDataTrackPublication[];

  listenersByEventType = new ListenersByEventType<LocalParticipantEventType>();
  subscriptionsByEventType: SubscriptionsByEventType = {};

  localAudioTrackIndicesToDelete?: number[];
  localVideoTrackIndicesToDelete?: number[];
  localDataTrackIndicesToDelete?: number[];

  constructor({
    identity,
    sid,
    networkQualityLevel,
    localAudioTracks,
    localVideoTracks,
    localDataTracks,
  }: LocalParticipantAttributes) {
    this.identity = identity;
    this.sid = sid;
    this.networkQualityLevel = networkQualityLevel;
    this.localAudioTracks = localAudioTracks.map(
      (localAudioTrackPublication) =>
        new LocalAudioTrackPublication(localAudioTrackPublication)
    );
    this.localVideoTracks = localVideoTracks.map(
      (localVideoTrackPublication) =>
        new LocalVideoTrackPublication(localVideoTrackPublication)
    );
    this.localDataTracks = localDataTracks.map(
      (localDataTrackPublication) =>
        new LocalDataTrackPublication(localDataTrackPublication)
    );
  }

  publishLocalAudioTrack = async (
    localAudioTrack: LocalAudioTrack
  ): Promise<boolean> => {
    if (!this.sid) {
      throw "can't publish local audio track before local participant has connected";
    }

    return await TwilioVideo.publishLocalAudioTrack({
      localAudioTrackName: localAudioTrack.name,
      localParticipantSid: this.sid,
    });
  };

  publishLocalVideoTrack = async (
    localVideoTrack: LocalVideoTrack
  ): Promise<boolean> => {
    if (!this.sid) {
      throw "can't publish local video track before local participant has connected";
    }

    return await TwilioVideo.publishLocalVideoTrack({
      localVideoTrackName: localVideoTrack.name,
      localParticipantSid: this.sid,
    });
  };

  unpublishLocalAudioTrack = async (
    localAudioTrack: LocalAudioTrack
  ): Promise<boolean> => {
    if (!this.sid) {
      throw "can't unpublish local audio track before local participant has connected";
    }

    return await TwilioVideo.unpublishLocalAudioTrack({
      localAudioTrackName: localAudioTrack.name,
      localParticipantSid: this.sid,
    });
  };

  unpublishLocalVideoTrack = async (
    localVideoTrack: LocalVideoTrack
  ): Promise<boolean> => {
    if (!this.sid) {
      throw "can't unpublish local video track before local participant has connected";
    }

    return await TwilioVideo.unpublishLocalVideoTrack({
      localVideoTrackName: localVideoTrack.name,
      localParticipantSid: this.sid,
    });
  };

  on = (eventType: LocalParticipantEventType, listener: Listener) => {
    if (!this.listenersByEventType.isListeningTo(eventType)) {
      this.subscriptionsByEventType[
        eventType
      ] = TwilioVideoEventEmitter.addListener(
        `LocalParticipant.${eventType}`,
        this.EVENT_HANDLERS[eventType]
      );
    }
    this.listenersByEventType.add(eventType, listener);
  };

  off = (eventType: LocalParticipantEventType, listener: Listener) => {
    this.listenersByEventType.remove(eventType, listener);
    if (!this.listenersByEventType.isListeningTo(eventType)) {
      this.subscriptionsByEventType[eventType].remove();
      delete this.subscriptionsByEventType[eventType];
    }
  };

  handleEvent = <Data extends LocalParticipantEventData>(
    remoteParticipantEventType: LocalParticipantEventType,
    data: any,
    buildListenerData?: (eventData: Data) => any
  ) => {
    const remoteParticipantEventData = data as Data;
    if (remoteParticipantEventData.participant.sid !== this.sid) {
      return;
    }
    this.mergeLocalParticipantAttributesBegin(
      remoteParticipantEventData.participant
    );
    const listenerData = buildListenerData
      ? buildListenerData(remoteParticipantEventData)
      : { participant: this };
    this.listenersByEventType
      .get(remoteParticipantEventType)
      .forEach((listener) => {
        listener(listenerData);
      });
    this.mergeLocalParticipantAttributesCleanup();
  };

  onAudioTrackPublicationFailed = (data: any) => {
    this.handleEvent(
      'audioTrackPublicationFailed',
      data,
      ({
        audioTrack,
        error,
      }: LocalParticipantEventData & {
        audioTrack: LocalAudioTrackAttributes;
        error: string;
      }) => ({
        participant: this,
        audioTrack,
        error,
      })
    );
  };

  onAudioTrackPublished = (data: any) => {
    this.handleEvent(
      'audioTrackPublished',
      data,
      ({
        audioTrackPublication: { trackSid },
      }: LocalParticipantEventData & {
        audioTrackPublication: LocalAudioTrackPublicationAttributes;
      }) => {
        const audioTrackPublication = this.findLocalAudioTrack(trackSid);
        return {
          paticipant: this,
          audioTrackPublication,
        };
      }
    );
  };

  onDataTrackPublicationFailed = (data: any) => {
    this.handleEvent(
      'dataTrackPublicationFailed',
      data,
      ({
        dataTrack,
        error,
      }: LocalParticipantEventData & {
        dataTrack: LocalDataTrackAttributes;
        error: string;
      }) => ({
        participant: this,
        dataTrack,
        error,
      })
    );
  };
  onDataTrackPublished = (data: any) => {
    this.handleEvent(
      'dataTrackPublished',
      data,
      ({
        dataTrackPublication: { trackSid },
      }: LocalParticipantEventData & {
        dataTrackPublication: LocalDataTrackPublicationAttributes;
      }) => {
        const dataTrackPublication = this.findLocalDataTrack(trackSid);
        return {
          paticipant: this,
          dataTrackPublication,
        };
      }
    );
  };

  onNetworkQualityLevelChanged = (data: any) => {
    this.handleEvent(
      'networkQualityLevelChanged',
      data,
      ({
        networkQualityLevel,
      }: LocalParticipantEventData & {
        networkQualityLevel: string | null;
      }) => ({
        participant: this,
        networkQualityLevel,
      })
    );
  };

  onVideoTrackPublicationFailed = (data: any) => {
    this.handleEvent(
      'videoTrackPublicationFailed',
      data,
      ({
        videoTrack,
        error,
      }: LocalParticipantEventData & {
        videoTrack: LocalVideoTrackAttributes;
        error: string;
      }) => ({
        participant: this,
        videoTrack,
        error,
      })
    );
  };

  onVideoTrackPublished = (data: any) => {
    this.handleEvent(
      'videoTrackPublished',
      data,
      ({
        videoTrackPublication: { trackSid },
      }: LocalParticipantEventData & {
        videoTrackPublication: LocalVideoTrackPublicationAttributes;
      }) => {
        const videoTrackPublication = this.findLocalVideoTrack(trackSid);
        return {
          paticipant: this,
          videoTrackPublication,
        };
      }
    );
  };

  EVENT_HANDLERS = {} as { [eventType: string]: (data: any) => void };

  mergeLocalParticipantAttributes = (
    localParticipantAttributes: LocalParticipantAttributes
  ) => {
    this.mergeLocalParticipantAttributesBegin(localParticipantAttributes);
    this.mergeLocalParticipantAttributesCleanup();
  };

  mergeLocalParticipantAttributesBegin = ({
    identity,
    sid,
    networkQualityLevel,
    localAudioTracks,
    localVideoTracks,
    localDataTracks,
  }: LocalParticipantAttributes) => {
    if (
      this.localAudioTrackIndicesToDelete ||
      this.localVideoTrackIndicesToDelete ||
      this.localDataTrackIndicesToDelete
    ) {
      throw 'attempting to merge local participant attributes before completing previous merge operation';
    }

    this.identity = identity;
    this.sid = sid;
    this.networkQualityLevel = networkQualityLevel;

    const localAudioTracksAttributesByTrackSid = {} as {
      [trackSid: string]: LocalAudioTrackPublicationAttributes;
    };
    localAudioTracks.forEach((localAudioTrack) => {
      localAudioTracksAttributesByTrackSid[
        localAudioTrack.trackSid
      ] = localAudioTrack;
    });

    const localAudioTrackIndicesToDelete = [] as number[];
    this.localAudioTracks.forEach((localAudioTrack, index) => {
      const localAudioTrackAttributes =
        localAudioTracksAttributesByTrackSid[localAudioTrack.trackSid];
      if (localAudioTrackAttributes) {
        localAudioTrack.mergeLocalAudioTrackPublicationAttributes(
          localAudioTrackAttributes
        );
        delete localAudioTracksAttributesByTrackSid[localAudioTrack.trackSid];
      } else {
        localAudioTrackIndicesToDelete.push(index);
      }
    });
    this.localAudioTrackIndicesToDelete = localAudioTrackIndicesToDelete;

    Object.values(localAudioTracksAttributesByTrackSid).forEach(
      (localAudioTrackAttributes) => {
        this.localAudioTracks.push(
          new LocalAudioTrackPublication(localAudioTrackAttributes)
        );
      }
    );

    const localVideoTracksAttributesByTrackSid = {} as {
      [trackSid: string]: LocalVideoTrackPublicationAttributes;
    };
    localVideoTracks.forEach((localVideoTrack) => {
      localVideoTracksAttributesByTrackSid[
        localVideoTrack.trackSid
      ] = localVideoTrack;
    });

    const localVideoTrackIndicesToDelete = [] as number[];
    this.localVideoTracks.forEach((localVideoTrack, index) => {
      const localVideoTrackAttributes =
        localVideoTracksAttributesByTrackSid[localVideoTrack.trackSid];
      if (localVideoTrackAttributes) {
        localVideoTrack.mergeLocalVideoTrackPublicationAttributes(
          localVideoTrackAttributes
        );
        delete localVideoTracksAttributesByTrackSid[localVideoTrack.trackSid];
      } else {
        localVideoTrackIndicesToDelete.push(index);
      }
    });
    this.localVideoTrackIndicesToDelete = localVideoTrackIndicesToDelete;

    Object.values(localVideoTracksAttributesByTrackSid).forEach(
      (localVideoTrackAttributes) => {
        this.localVideoTracks.push(
          new LocalVideoTrackPublication(localVideoTrackAttributes)
        );
      }
    );

    const localDataTracksAttributesByTrackSid = {} as {
      [trackSid: string]: LocalDataTrackPublicationAttributes;
    };
    localDataTracks.forEach((localDataTrack) => {
      localDataTracksAttributesByTrackSid[
        localDataTrack.trackSid
      ] = localDataTrack;
    });

    const localDataTrackIndicesToDelete = [] as number[];
    this.localDataTracks.forEach((localDataTrack, index) => {
      const localDataTrackAttributes =
        localDataTracksAttributesByTrackSid[localDataTrack.trackSid];
      if (localDataTrackAttributes) {
        localDataTrack.mergeLocalDataTrackPublicationAttributes(
          localDataTrackAttributes
        );
        delete localDataTracksAttributesByTrackSid[localDataTrack.trackSid];
      } else {
        localDataTrackIndicesToDelete.push(index);
      }
    });
    this.localDataTrackIndicesToDelete = localDataTrackIndicesToDelete;

    Object.values(localDataTracksAttributesByTrackSid).forEach(
      (localDataTrackAttributes) => {
        this.localDataTracks.push(
          new LocalDataTrackPublication(localDataTrackAttributes)
        );
      }
    );
  };

  mergeLocalParticipantAttributesCleanup = () => {
    if (
      !this.localAudioTrackIndicesToDelete ||
      !this.localVideoTrackIndicesToDelete ||
      !this.localDataTrackIndicesToDelete
    ) {
      throw 'attempting to mergeLocalParticipantAttributesCleanup without a merge in progress';
    }

    this.localAudioTrackIndicesToDelete.sort((a, b) => b - a);
    this.localAudioTrackIndicesToDelete.forEach((index) => {
      const localAudioTrackToDelete = this.localAudioTracks[index];
      localAudioTrackToDelete.destroy();
      this.localAudioTracks.splice(index, 1);
    });

    delete this.localAudioTrackIndicesToDelete;

    this.localVideoTrackIndicesToDelete.sort((a, b) => b - a);
    this.localVideoTrackIndicesToDelete.forEach((index) => {
      const localVideoTrackToDelete = this.localVideoTracks[index];
      localVideoTrackToDelete.destroy();
      this.localVideoTracks.splice(index, 1);
    });

    delete this.localVideoTrackIndicesToDelete;

    this.localDataTrackIndicesToDelete.sort((a, b) => b - a);
    this.localDataTrackIndicesToDelete.forEach((index) => {
      const localDataTrackToDelete = this.localDataTracks[index];
      localDataTrackToDelete.destroy();
      this.localDataTracks.splice(index, 1);
    });

    delete this.localDataTrackIndicesToDelete;
  };

  findLocalAudioTrack = (trackSid: string) => {
    return this.localAudioTracks.find(
      (localAudioTrackPublication) =>
        localAudioTrackPublication.trackSid === trackSid
    );
  };

  findLocalVideoTrack = (trackSid: string) => {
    return this.localVideoTracks.find(
      (localVideoTrackPublication) =>
        localVideoTrackPublication.trackSid === trackSid
    );
  };

  findLocalDataTrack = (trackSid: string) => {
    return this.localDataTracks.find(
      (localDataTrackPublication) =>
        localDataTrackPublication.trackSid === trackSid
    );
  };

  destroy = () => {};
}
