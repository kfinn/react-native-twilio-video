import type { EmitterSubscription } from 'react-native';
import { TwilioVideo, TwilioVideoEventEmitter } from '../TwilioVideo';
import ListenersByEventType, { Listener } from './ListenersByEventType';
import type { RemoteParticipantAttributes } from './RemoteParticipant';
import RemoteParticipant from './RemoteParticipant';

type RoomEventType =
  | 'connected'
  | 'failedToConnect'
  | 'disconnected'
  | 'reconnecting'
  | 'reconnected'
  | 'participantConnected'
  | 'participantDisconnected'
  | 'recordingStarted'
  | 'recordingStopped'
  | 'dominantSpeakerChanged';

interface RoomAttributes {
  sid: string;
  name: string;
  state: string;
  isRecording: boolean;
  remoteParticipants: RemoteParticipantAttributes[];
}

interface SubscriptionsByEventType {
  [key: string]: EmitterSubscription;
}

interface RoomEventData {
  room: RoomAttributes;
}

export default class Room implements RoomAttributes {
  sid: string;
  name: string;
  state: string;
  isRecording: boolean;
  remoteParticipants: RemoteParticipant[];

  listenersByEventType = new ListenersByEventType<RoomEventType>();
  subscriptionsByEventType: SubscriptionsByEventType = {};
  remoteParticipantIndicesToDelete?: number[];

  private constructor({
    sid,
    name,
    state,
    isRecording,
    remoteParticipants,
  }: RoomAttributes) {
    this.sid = sid;
    this.name = name;
    this.state = state;
    this.isRecording = isRecording;
    this.remoteParticipants = remoteParticipants.map(
      (remoteParticipant) => new RemoteParticipant(remoteParticipant)
    );
  }

  static connect = async (token: string, options: any): Promise<Room> => {
    const roomAttributes = await TwilioVideo.connect(token, options);
    return new Room(roomAttributes);
  };

  disconnect = async (): Promise<boolean> => {
    return await TwilioVideo.disconnect(this.sid);
  };

  on = (eventType: RoomEventType, listener: Listener) => {
    if (!this.listenersByEventType.isListeningTo(eventType)) {
      this.subscriptionsByEventType[
        eventType
      ] = TwilioVideoEventEmitter.addListener(
        `Room.${eventType}`,
        this.EVENT_HANDLERS[eventType]
      );
    }
    this.listenersByEventType.add(eventType, listener);
  };

  off = (eventType: RoomEventType, listener: Listener) => {
    this.listenersByEventType.remove(eventType, listener);
    if (!this.listenersByEventType.isListeningTo(eventType)) {
      TwilioVideo.removeSubscription(this.subscriptionsByEventType[eventType]);
      delete this.subscriptionsByEventType[eventType];
    }
  };

  handleEvent = <Data extends RoomEventData>(
    roomEventType: RoomEventType,
    data: any,
    buildListenerData?: (eventData: Data) => any
  ) => {
    const roomEventData = data as Data;
    this.mergeRoomAttributesBegin(roomEventData.room);
    const listenerData = buildListenerData
      ? buildListenerData(roomEventData)
      : { room: this };
    this.listenersByEventType.get(roomEventType).forEach((listener) => {
      listener(listenerData);
    });
    this.mergeRoomAttributesCleanup();
  };

  onConnected = (data: any) => {
    this.handleEvent('connected', data, () => ({ room: this }));
  };

  onFailedToConnect = (data: any) => {
    this.handleEvent(
      'failedToConnect',
      data,
      ({ error }: RoomEventData & { error: string }) => ({ room: this, error })
    );
  };

  onDisconnected = (data: any) => {
    this.handleEvent(
      'disconnected',
      data,
      ({ error }: RoomEventData & { error: string }) => ({ room: this, error })
    );
  };

  onReconnecting = (data: any) => {
    this.handleEvent(
      'reconnecting',
      data,
      ({ error }: RoomEventData & { error: string }) => ({ room: this, error })
    );
  };

  onReconnected = (data: any) => {
    this.handleEvent('reconnected', data, () => ({ room: this }));
  };

  onParticipantConnected = (data: any) => {
    this.handleEvent(
      'participantConnected',
      data,
      ({
        participant,
      }: RoomEventData & { participant: RemoteParticipantAttributes }) => {
        const remoteParticipant = this.findRemoteParticipant(participant.sid);
        return { room: this, participant: remoteParticipant };
      }
    );
  };

  onParticipantDisconnected = (data: any) => {
    this.handleEvent(
      'participantDisconnected',
      data,
      ({
        participant,
      }: RoomEventData & { participant: RemoteParticipantAttributes }) => {
        const remoteParticipant = this.findRemoteParticipant(participant.sid);
        return { room: this, participant: remoteParticipant };
      }
    );
  };

  onRecordingStarted = (data: any) => {
    this.handleEvent('recordingStarted', data, () => ({ room: this }));
  };

  onRecordingStopped = (data: any) => {
    this.handleEvent('recordingStopped', data, () => ({ room: this }));
  };

  onDominantSpeakerChanged = (data: any) => {
    this.handleEvent(
      'dominantSpeakerChanged',
      data,
      ({
        participant,
      }: RoomEventData & { participant: RemoteParticipantAttributes }) => {
        if (participant) {
          const remoteParticipant = this.findRemoteParticipant(participant.sid);
          return { room: this, participant: remoteParticipant };
        } else {
          return { room: this, participant: null };
        }
      }
    );
  };

  EVENT_HANDLERS = {
    connected: this.onConnected,
    failedToConnect: this.onFailedToConnect,
    disconnected: this.onDisconnected,
    reconnecting: this.onReconnecting,
    reconnected: this.onReconnected,
    participantConnected: this.onParticipantConnected,
    participantDisconnected: this.onParticipantDisconnected,
    recordingStarted: this.onRecordingStarted,
    recordingStopped: this.onRecordingStopped,
    dominantSpeakerChanged: this.onDominantSpeakerChanged,
  } as { [eventType: string]: (data: any) => void };

  mergeRoomAttributesBegin = ({
    sid,
    name,
    state,
    isRecording,
    remoteParticipants,
  }: RoomAttributes) => {
    if (this.remoteParticipantIndicesToDelete) {
      throw 'attempting to merge room attributes before completing previous merge operation';
    }

    this.sid = sid;
    this.name = name;
    this.state = state;
    this.isRecording = isRecording;

    const remoteParticipantsAttributesBySid = {} as {
      [sid: string]: RemoteParticipantAttributes;
    };
    remoteParticipants.forEach((remoteParticipant) => {
      remoteParticipantsAttributesBySid[
        remoteParticipant.sid
      ] = remoteParticipant;
    });

    const remoteParticipantIndicesToDelete = [] as number[];
    this.remoteParticipants.forEach((remoteParticipant, index) => {
      const remoteParticipantAttributes =
        remoteParticipantsAttributesBySid[remoteParticipant.sid];
      if (remoteParticipantAttributes) {
        remoteParticipant.mergeRemoteParticipantAttributes(
          remoteParticipantAttributes
        );
        delete remoteParticipantsAttributesBySid[remoteParticipant.sid];
      } else {
        remoteParticipantIndicesToDelete.push(index);
      }
    });
    this.remoteParticipantIndicesToDelete = this.remoteParticipantIndicesToDelete;

    Object.values(remoteParticipantsAttributesBySid).forEach(
      (remoteParticipantAttributes) => {
        this.remoteParticipants.push(
          new RemoteParticipant(remoteParticipantAttributes)
        );
      }
    );
  };

  mergeRoomAttributesCleanup = () => {
    if (!this.remoteParticipantIndicesToDelete) {
      throw 'attempting to mergeRoomAttributesCleanup without a merge in progress';
    }

    this.remoteParticipantIndicesToDelete.sort((a, b) => b - a);
    this.remoteParticipantIndicesToDelete.forEach((index) => {
      const remoteParticipantToDelete = this.remoteParticipants[index];
      remoteParticipantToDelete.destroy();
      this.remoteParticipants.slice(index, 1);
    });

    delete this.remoteParticipantIndicesToDelete;
  };

  findRemoteParticipant = (sid: string) => {
    return this.remoteParticipants.find(
      (remoteParticipant) => remoteParticipant.sid === sid
    );
  };
}
