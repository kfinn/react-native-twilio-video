import { TwilioVideo, TwilioVideoEventEmitter } from '../TwilioVideo';
import type { Listener } from './ListenersByEventType';
import ListenersByEventType from './ListenersByEventType';
import type { RemoteAudioTrackPublicationAttributes } from './RemoteAudioTrackPublication';
import RemoteAudioTrackPublication from './RemoteAudioTrackPublication';
import type { RemoteDataTrackPublicationAttributes } from './RemoteDataTrackPublication';
import RemoteDataTrackPublication from './RemoteDataTrackPublication';
import type { RemoteVideoTrackAttributes } from './RemoteVideoTrack';
import type { RemoteVideoTrackPublicationAttributes } from './RemoteVideoTrackPublication';
import RemoteVideoTrackPublication from './RemoteVideoTrackPublication';
import type { SubscriptionsByEventType } from './Room';

type RemoteParticipantEventType =
  | 'audioTrackDisabled'
  | 'audioTrackEnabled'
  | 'audioTrackPublished'
  | 'audioTrackPublishPriorityChanged'
  | 'audioTrackSubscribed'
  | 'audioTrackSubscriptionFailed'
  | 'audioTrackUnpublished'
  | 'audioTrackUnsubscribed'
  | 'dataTrackPublished'
  | 'dataTrackPublishPriorityChanged'
  | 'dataTrackSubscribed'
  | 'dataTrackSubscriptionFailed'
  | 'dataTrackUnpublished'
  | 'dataTrackUnsubscribed'
  | 'networkQualityLevelChanged'
  | 'videoTrackDisabled'
  | 'videoTrackEnabled'
  | 'videoTrackPublished'
  | 'videoTrackPublishPriorityChanged'
  | 'videoTrackSubscribed'
  | 'videoTrackSubscriptionFailed'
  | 'videoTrackSwitchedOff'
  | 'videoTrackSwitchedOn'
  | 'videoTrackUnpublished'
  | 'videoTrackUnsubscribed';

export interface RemoteParticipantAttributes {
  connected: boolean;
  identity: string;
  sid: string;
  networkQualityLevel: string;
  remoteAudioTracks: RemoteAudioTrackPublicationAttributes[];
  remoteVideoTracks: RemoteVideoTrackPublicationAttributes[];
  remoteDataTracks: RemoteDataTrackPublicationAttributes[];
}

interface RemoteParticipantEventData {
  participant: RemoteParticipantAttributes;
}

export default class RemoteParticipant implements RemoteParticipantAttributes {
  connected: boolean;
  identity: string;
  sid: string;
  networkQualityLevel: string;
  remoteAudioTracks: RemoteAudioTrackPublication[];
  remoteVideoTracks: RemoteVideoTrackPublication[];
  remoteDataTracks: RemoteDataTrackPublication[];

  listenersByEventType = new ListenersByEventType<RemoteParticipantEventType>();
  subscriptionsByEventType: SubscriptionsByEventType = {};

  remoteAudioTrackIndicesToDelete?: number[];
  remoteVideoTrackIndicesToDelete?: number[];
  remoteDataTrackIndicesToDelete?: number[];

  constructor({
    connected,
    identity,
    sid,
    networkQualityLevel,
    remoteAudioTracks,
    remoteVideoTracks,
    remoteDataTracks,
  }: RemoteParticipantAttributes) {
    this.connected = connected;
    this.identity = identity;
    this.sid = sid;
    this.networkQualityLevel = networkQualityLevel;
    this.remoteAudioTracks = remoteAudioTracks.map(
      (remoteAudioTrack) => new RemoteAudioTrackPublication(remoteAudioTrack)
    );
    this.remoteVideoTracks = remoteVideoTracks.map(
      (remoteVideoTrack) => new RemoteVideoTrackPublication(remoteVideoTrack)
    );
    this.remoteDataTracks = remoteDataTracks.map(
      (remoteDataTrack) => new RemoteDataTrackPublication(remoteDataTrack)
    );
  }

  on = (eventType: RemoteParticipantEventType, listener: Listener) => {
    if (!this.listenersByEventType.isListeningTo(eventType)) {
      this.subscriptionsByEventType[
        eventType
      ] = TwilioVideoEventEmitter.addListener(
        `RemoteParticipant.${eventType}`,
        this.EVENT_HANDLERS[eventType]
      );
    }
    this.listenersByEventType.add(eventType, listener);
  };

  off = (eventType: RemoteParticipantEventType, listener: Listener) => {
    this.listenersByEventType.remove(eventType, listener);
    if (!this.listenersByEventType.isListeningTo(eventType)) {
      TwilioVideo.removeSubscription(this.subscriptionsByEventType[eventType]);
      delete this.subscriptionsByEventType[eventType];
    }
  };

  handleEvent = <Data extends RemoteParticipantEventData>(
    roomEventType: RemoteParticipantEventType,
    data: any,
    buildListenerData?: (eventData: Data) => any
  ) => {
    const remoteParticipantEventData = data as Data;
    if (remoteParticipantEventData.participant.sid !== this.sid) {
      return;
    }
    this.mergeRemoteParticipantAttributesBegin(
      remoteParticipantEventData.participant
    );
    const listenerData = buildListenerData
      ? buildListenerData(remoteParticipantEventData)
      : { participant: this };
    this.listenersByEventType.get(roomEventType).forEach((listener) => {
      listener(listenerData);
    });
    this.mergeRemoteParticipantAttributesCleanup();
  };

  onAudioTrackDisabled = (data: any) => {
    this.handleEvent(
      'audioTrackDisabled',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteAudioTrackPublicationAttributes;
      }) => {
        return {
          participant: this,
          publication: this.findRemoteAudioTrack(trackSid),
        };
      }
    );
  };

  onAudioTrackEnabled = (data: any) => {
    this.handleEvent(
      'audioTrackEnabled',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteAudioTrackPublicationAttributes;
      }) => {
        return {
          participant: this,
          publication: this.findRemoteAudioTrack(trackSid),
        };
      }
    );
  };

  onAudioTrackPublished = (data: any) => {
    this.handleEvent(
      'audioTrackPublished',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteAudioTrackPublicationAttributes;
      }) => {
        return {
          participant: this,
          publication: this.findRemoteAudioTrack(trackSid),
        };
      }
    );
  };

  onAudioTrackPublishPriorityChanged = (data: any) => {
    this.handleEvent(
      'audioTrackPublishPriorityChanged',
      data,
      ({
        publication: { trackSid },
        priority,
      }: RemoteParticipantEventData & {
        publication: RemoteAudioTrackPublicationAttributes;
        priority: string;
      }) => {
        return {
          room: this,
          publication: this.findRemoteAudioTrack(trackSid),
          priority,
        };
      }
    );
  };

  onAudioTrackSubscribed = (data: any) => {
    this.handleEvent(
      'audioTrackSubscribed',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteAudioTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteAudioTrack(trackSid);
        return {
          participant: this,
          publication,
          audioTrack: publication!.remoteTrack,
        };
      }
    );
  };

  onAudioTrackSubscriptionFailed = (data: any) => {
    this.handleEvent(
      'audioTrackSubscriptionFailed',
      data,
      ({
        publication: { trackSid },
        error,
      }: RemoteParticipantEventData & {
        publication: RemoteAudioTrackPublicationAttributes;
        error: string;
      }) => {
        return {
          participant: this,
          publication: this.findRemoteAudioTrack(trackSid),
          error,
        };
      }
    );
  };

  onAudioTrackUnpublished = (data: any) => {
    this.handleEvent(
      'audioTrackUnpublished',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteAudioTrackPublicationAttributes;
      }) => {
        return {
          participant: this,
          publication: this.findRemoteAudioTrack(trackSid),
        };
      }
    );
  };

  onAudioTrackUnsubscribed = (data: any) => {
    this.handleEvent(
      'audioTrackUnsubscribed',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteAudioTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteAudioTrack(trackSid);
        return {
          participant: this,
          publication,
          audioTrack: publication!.remoteTrack,
        };
      }
    );
  };

  onDataTrackPublished = (data: any) => {
    this.handleEvent(
      'dataTrackPublished',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteDataTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteDataTrack(trackSid);
        return {
          participant: this,
          publication,
        };
      }
    );
  };

  onDataTrackPublishPriorityChanged = (data: any) => {
    this.handleEvent(
      'dataTrackPublishPriorityChanged',
      data,
      ({
        publication: { trackSid },
        priority,
      }: RemoteParticipantEventData & {
        publication: RemoteDataTrackPublicationAttributes;
        priority: string;
      }) => {
        const publication = this.findRemoteDataTrack(trackSid);
        return {
          participant: this,
          publication,
          priority,
        };
      }
    );
  };

  onDataTrackSubscribed = (data: any) => {
    this.handleEvent(
      'dataTrackSubscribed',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteDataTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteDataTrack(trackSid);
        return {
          participant: this,
          publication,
          dataTrack: publication!.remoteTrack,
        };
      }
    );
  };

  onDataTrackSubscriptionFailed = (data: any) => {
    this.handleEvent(
      'dataTrackSubscriptionFailed',
      data,
      ({
        publication: { trackSid },
        error,
      }: RemoteParticipantEventData & {
        publication: RemoteDataTrackPublicationAttributes;
        error: string;
      }) => {
        const publication = this.findRemoteDataTrack(trackSid);
        return {
          participant: this,
          publication,
          error,
        };
      }
    );
  };

  onDataTrackUnpublished = (data: any) => {
    this.handleEvent(
      'dataTrackUnpublished',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteDataTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteDataTrack(trackSid);
        return {
          participant: this,
          publication,
        };
      }
    );
  };

  onDataTrackUnsubscribed = (data: any) => {
    this.handleEvent(
      'dataTrackUnsubscribed',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteDataTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteDataTrack(trackSid);
        return {
          participant: this,
          publication,
          dataTrack: publication!.remoteTrack,
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
      }: RemoteParticipantEventData & { networkQualityLevel: string }) => ({
        participant: this,
        networkQualityLevel,
      })
    );
  };

  onVideoTrackDisabled = (data: any) => {
    this.handleEvent(
      'videoTrackDisabled',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteVideoTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteVideoTrack(trackSid);
        return {
          participant: this,
          publication,
        };
      }
    );
  };

  onVideoTrackEnabled = (data: any) => {
    this.handleEvent(
      'videoTrackEnabled',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteVideoTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteVideoTrack(trackSid);
        return {
          participant: this,
          publication,
        };
      }
    );
  };

  onVideoTrackPublished = (data: any) => {
    this.handleEvent(
      'videoTrackPublished',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteVideoTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteVideoTrack(trackSid);
        return {
          participant: this,
          publication,
        };
      }
    );
  };

  onVideoTrackPublishPriorityChanged = (data: any) => {
    this.handleEvent(
      'videoTrackPublishPriorityChanged',
      data,
      ({
        publication: { trackSid },
        priority,
      }: RemoteParticipantEventData & {
        publication: RemoteVideoTrackPublicationAttributes;
        priority: string;
      }) => {
        const publication = this.findRemoteVideoTrack(trackSid);
        return {
          participant: this,
          publication,
          priority,
        };
      }
    );
  };

  onVideoTrackSubscribed = (data: any) => {
    this.handleEvent(
      'videoTrackSubscribed',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteVideoTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteVideoTrack(trackSid);
        return {
          participant: this,
          publication,
          videoTrack: publication!.remoteTrack,
        };
      }
    );
  };

  onVideoTrackSubscriptionFailed = (data: any) => {
    this.handleEvent(
      'videoTrackSubscriptionFailed',
      data,
      ({
        publication: { trackSid },
        error,
      }: RemoteParticipantEventData & {
        publication: RemoteVideoTrackPublicationAttributes;
        error: string;
      }) => {
        const publication = this.findRemoteVideoTrack(trackSid);
        return {
          participant: this,
          publication,
          error,
        };
      }
    );
  };

  onVideoTrackSwitchedOff = (data: any) => {
    this.handleEvent(
      'videoTrackSwitchedOff',
      data,
      ({
        track: { sid },
      }: RemoteParticipantEventData & {
        track: RemoteVideoTrackAttributes;
      }) => {
        const publication = this.findRemoteVideoTrack(sid);
        return {
          participant: this,
          track: publication!.remoteTrack,
        };
      }
    );
  };

  onVideoTrackSwitchedOn = (data: any) => {
    this.handleEvent(
      'videoTrackSwitchedOn',
      data,
      ({
        track: { sid },
      }: RemoteParticipantEventData & {
        track: RemoteVideoTrackAttributes;
      }) => {
        const publication = this.findRemoteVideoTrack(sid);
        return {
          participant: this,
          track: publication!.remoteTrack,
        };
      }
    );
  };

  onVideoTrackUnpublished = (data: any) => {
    this.handleEvent(
      'videoTrackUnpublished',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteVideoTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteVideoTrack(trackSid);
        return {
          participant: this,
          publication,
        };
      }
    );
  };

  onVideoTrackUnsubscribed = (data: any) => {
    this.handleEvent(
      'videoTrackUnsubscribed',
      data,
      ({
        publication: { trackSid },
      }: RemoteParticipantEventData & {
        publication: RemoteVideoTrackPublicationAttributes;
      }) => {
        const publication = this.findRemoteVideoTrack(trackSid);
        return {
          participant: this,
          publication,
          videoTrack: publication!.remoteTrack,
        };
      }
    );
  };

  EVENT_HANDLERS = {
    audioTrackDisabled: this.onAudioTrackDisabled,
    audioTrackEnabled: this.onAudioTrackEnabled,
    audioTrackPublished: this.onAudioTrackPublished,
    audioTrackPublishPriorityChanged: this.onAudioTrackPublishPriorityChanged,
    audioTrackSubscribed: this.onAudioTrackSubscribed,
    audioTrackSubscriptionFailed: this.onAudioTrackSubscriptionFailed,
    audioTrackUnpublished: this.onAudioTrackUnpublished,
    audioTrackUnsubscribed: this.onAudioTrackUnsubscribed,
    dataTrackPublished: this.onDataTrackPublished,
    dataTrackPublishPriorityChanged: this.onDataTrackPublishPriorityChanged,
    dataTrackSubscribed: this.onDataTrackSubscribed,
    dataTrackSubscriptionFailed: this.onDataTrackSubscriptionFailed,
    dataTrackUnpublished: this.onDataTrackUnpublished,
    dataTrackUnsubscribed: this.onDataTrackUnsubscribed,
    networkQualityLevelChanged: this.onNetworkQualityLevelChanged,
    videoTrackDisabled: this.onVideoTrackDisabled,
    videoTrackEnabled: this.onVideoTrackEnabled,
    videoTrackPublished: this.onVideoTrackPublished,
    videoTrackPublishPriorityChanged: this.onVideoTrackPublishPriorityChanged,
    videoTrackSubscribed: this.onVideoTrackSubscribed,
    videoTrackSubscriptionFailed: this.onVideoTrackSubscriptionFailed,
    videoTrackSwitchedOff: this.onVideoTrackSwitchedOff,
    videoTrackSwitchedOn: this.onVideoTrackSwitchedOn,
    videoTrackUnpublished: this.onVideoTrackUnpublished,
    videoTrackUnsubscribed: this.onVideoTrackUnsubscribed,
  } as { [eventType: string]: (data: any) => void };

  mergeRemoteParticipantAttributes = (
    remoteParticipantAttributes: RemoteParticipantAttributes
  ) => {
    this.mergeRemoteParticipantAttributesBegin(remoteParticipantAttributes);
    this.mergeRemoteParticipantAttributesCleanup();
  };

  mergeRemoteParticipantAttributesBegin = ({
    connected,
    identity,
    sid,
    networkQualityLevel,
    remoteAudioTracks,
    remoteVideoTracks,
    remoteDataTracks,
  }: RemoteParticipantAttributes) => {
    if (
      this.remoteAudioTrackIndicesToDelete ||
      this.remoteVideoTrackIndicesToDelete ||
      this.remoteDataTrackIndicesToDelete
    ) {
      throw 'attempting to merge remote participant attributes before completing previous merge operation';
    }

    this.connected = connected;
    this.identity = identity;
    this.sid = sid;
    this.networkQualityLevel = networkQualityLevel;

    const remoteAudioTracksAttributesByTrackSid = {} as {
      [trackSid: string]: RemoteAudioTrackPublicationAttributes;
    };
    remoteAudioTracks.forEach((remoteAudioTrack) => {
      remoteAudioTracksAttributesByTrackSid[
        remoteAudioTrack.trackSid
      ] = remoteAudioTrack;
    });

    const remoteAudioTrackIndicesToDelete = [] as number[];
    this.remoteAudioTracks.forEach((remoteAudioTrack, index) => {
      const remoteAudioTrackAttributes =
        remoteAudioTracksAttributesByTrackSid[remoteAudioTrack.trackSid];
      if (remoteAudioTrackAttributes) {
        remoteAudioTrack.mergeRemoteAudioTrackPublicationAttributes(
          remoteAudioTrackAttributes
        );
        delete remoteAudioTracksAttributesByTrackSid[remoteAudioTrack.trackSid];
      } else {
        remoteAudioTrackIndicesToDelete.push(index);
      }
    });
    this.remoteAudioTrackIndicesToDelete = remoteAudioTrackIndicesToDelete;

    Object.values(remoteAudioTracksAttributesByTrackSid).forEach(
      (remoteAudioTrackAttributes) => {
        this.remoteAudioTracks.push(
          new RemoteAudioTrackPublication(remoteAudioTrackAttributes)
        );
      }
    );

    const remoteVideoTracksAttributesByTrackSid = {} as {
      [trackSid: string]: RemoteVideoTrackPublicationAttributes;
    };
    remoteVideoTracks.forEach((remoteVideoTrack) => {
      remoteVideoTracksAttributesByTrackSid[
        remoteVideoTrack.trackSid
      ] = remoteVideoTrack;
    });

    const remoteVideoTrackIndicesToDelete = [] as number[];
    this.remoteVideoTracks.forEach((remoteVideoTrack, index) => {
      const remoteVideoTrackAttributes =
        remoteVideoTracksAttributesByTrackSid[remoteVideoTrack.trackSid];
      if (remoteVideoTrackAttributes) {
        remoteVideoTrack.mergeRemoteVideoTrackPublicationAttributes(
          remoteVideoTrackAttributes
        );
        delete remoteVideoTracksAttributesByTrackSid[remoteVideoTrack.trackSid];
      } else {
        remoteVideoTrackIndicesToDelete.push(index);
      }
    });
    this.remoteVideoTrackIndicesToDelete = remoteVideoTrackIndicesToDelete;

    Object.values(remoteVideoTracksAttributesByTrackSid).forEach(
      (remoteVideoTrackAttributes) => {
        this.remoteVideoTracks.push(
          new RemoteVideoTrackPublication(remoteVideoTrackAttributes)
        );
      }
    );

    const remoteDataTracksAttributesByTrackSid = {} as {
      [trackSid: string]: RemoteDataTrackPublicationAttributes;
    };
    remoteDataTracks.forEach((remoteDataTrack) => {
      remoteDataTracksAttributesByTrackSid[
        remoteDataTrack.trackSid
      ] = remoteDataTrack;
    });

    const remoteDataTrackIndicesToDelete = [] as number[];
    this.remoteDataTracks.forEach((remoteDataTrack, index) => {
      const remoteDataTrackAttributes =
        remoteDataTracksAttributesByTrackSid[remoteDataTrack.trackSid];
      if (remoteDataTrackAttributes) {
        remoteDataTrack.mergeRemoteDataTrackPublicationAttributes(
          remoteDataTrackAttributes
        );
        delete remoteDataTracksAttributesByTrackSid[remoteDataTrack.trackSid];
      } else {
        remoteDataTrackIndicesToDelete.push(index);
      }
    });
    this.remoteDataTrackIndicesToDelete = remoteDataTrackIndicesToDelete;

    Object.values(remoteDataTracksAttributesByTrackSid).forEach(
      (remoteDataTrackAttributes) => {
        this.remoteDataTracks.push(
          new RemoteDataTrackPublication(remoteDataTrackAttributes)
        );
      }
    );
  };

  mergeRemoteParticipantAttributesCleanup = () => {
    if (
      !this.remoteAudioTrackIndicesToDelete ||
      !this.remoteVideoTrackIndicesToDelete ||
      !this.remoteDataTrackIndicesToDelete
    ) {
      throw 'attempting to mergeRemoteParticipantAttributesCleanup without a merge in progress';
    }

    this.remoteAudioTrackIndicesToDelete.sort((a, b) => b - a);
    this.remoteAudioTrackIndicesToDelete.forEach((index) => {
      const remoteAudioTrackToDelete = this.remoteAudioTracks[index];
      remoteAudioTrackToDelete.destroy();
      this.remoteAudioTracks.splice(index, 1);
    });

    delete this.remoteAudioTrackIndicesToDelete;

    this.remoteVideoTrackIndicesToDelete.sort((a, b) => b - a);
    this.remoteVideoTrackIndicesToDelete.forEach((index) => {
      const remoteVideoTrackToDelete = this.remoteVideoTracks[index];
      remoteVideoTrackToDelete.destroy();
      this.remoteVideoTracks.splice(index, 1);
    });

    delete this.remoteVideoTrackIndicesToDelete;

    this.remoteDataTrackIndicesToDelete.sort((a, b) => b - a);
    this.remoteDataTrackIndicesToDelete.forEach((index) => {
      const remoteDataTrackToDelete = this.remoteDataTracks[index];
      remoteDataTrackToDelete.destroy();
      this.remoteDataTracks.splice(index, 1);
    });

    delete this.remoteDataTrackIndicesToDelete;
  };

  findRemoteAudioTrack = (trackSid: string) => {
    return this.remoteAudioTracks.find(
      (remoteAudioTrackPublication) =>
        remoteAudioTrackPublication.trackSid === trackSid
    );
  };

  findRemoteVideoTrack = (trackSid: string) => {
    return this.remoteVideoTracks.find(
      (remoteVideoTrackPublication) =>
        remoteVideoTrackPublication.trackSid === trackSid
    );
  };

  findRemoteDataTrack = (trackSid: string) => {
    return this.remoteDataTracks.find(
      (remoteDataTrackPublication) =>
        remoteDataTrackPublication.trackSid === trackSid
    );
  };

  destroy = () => {};
}
