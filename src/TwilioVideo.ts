import {
  EventSubscriptionVendor,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import type {
  LocalAudioTrackAttributes,
  LocalAudioTrackCreateParams,
} from './models/LocalAudioTrack';
import type {
  LocalVideoTrackAttributes,
  LocalVideoTrackCreateParams,
} from './models/LocalVideoTrack';
import type Room from './models/Room';

type TwilioVideoType = {
  connect(token: string, options: any): Promise<Room>;
  disconnect(uuid: string): Promise<boolean>;
  updateRemoteAudioTrack(
    sid: string,
    params: { isPlaybackEnabled: boolean }
  ): Promise<boolean>;
  createLocalAudioTrack(
    params: LocalAudioTrackCreateParams
  ): Promise<LocalAudioTrackAttributes>;
  createLocalVideoTrack(
    params: LocalVideoTrackCreateParams
  ): Promise<LocalVideoTrackAttributes>;
} & EventSubscriptionVendor;

export const TwilioVideo = NativeModules.TwilioVideo as TwilioVideoType;
export const TwilioVideoEventEmitter = new NativeEventEmitter(TwilioVideo);
