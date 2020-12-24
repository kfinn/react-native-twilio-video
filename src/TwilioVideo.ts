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

export interface VideoDimensions {
  width: number;
  height: number;
}

export type NetworkQualityVerbosity = 'minimal' | 'none';
export type BandwidthProfileVideoMode =
  | 'grid'
  | 'collaboration'
  | 'presentation';
export type TrackPriority = 'low' | 'standard' | 'high';
export type TrackSwitchOffMode = 'predicted' | 'detected' | 'disabled';

interface SimpleVideoCodec {
  codec: 'H264' | 'VP9';
}

interface Vp8VideoCodec {
  codec: 'VP8';
  simulcast?: boolean;
}

export type VideoCodec = Vp8VideoCodec | SimpleVideoCodec;

export interface TwilioVideoConnectOptions {
  roomName?: string;
  audioTrackNames?: string[];
  videoTrackNames?: string[];
  isAutomaticSubscriptionEnabled?: boolean;
  isNetworkQualityEnabled?: boolean;
  isInsightsEnabled?: boolean;
  networkQualityConfiguration?: {
    local: NetworkQualityVerbosity;
    remote: NetworkQualityVerbosity;
  };
  isDominantSpeakerEnabled?: boolean;
  encodingParameters?: {
    audioBitrate: number;
    videoBitrate: number;
  };
  bandwidthProfile?: {
    video: {
      mode?: BandwidthProfileVideoMode;
      maxTracks?: number;
      dominantSpeakerPriority?: TrackPriority;
      trackSwitchOffMode?: TrackSwitchOffMode;
      renderDimensions?: {
        low: VideoDimensions;
        standard: VideoDimensions;
        high: VideoDimensions;
      };
      maxSubscriptionBitrate?: number;
    };
  };
  preferredVideoCodecs?: VideoCodec[];
}

type TwilioVideoType = {
  connect(token: string, options: TwilioVideoConnectOptions): Promise<Room>;
  disconnect(uuid: string): Promise<boolean>;
  updateLocalAudioTrack(
    name: string,
    params: { enabled: boolean }
  ): Promise<boolean>;
  updateLocalVideoTrack(
    name: string,
    params: { enabled: boolean }
  ): Promise<boolean>;
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
  destroyLocalAudioTrack(name: string): Promise<boolean>;
  destroyLocalVideoTrack(name: string): Promise<boolean>;
  publishLocalAudioTrack(params: {
    localAudioTrackName: string;
    localParticipantSid: string;
  }): Promise<boolean>;
  publishLocalVideoTrack(params: {
    localVideoTrackName: string;
    localParticipantSid: string;
  }): Promise<boolean>;
  unpublishLocalAudioTrack(params: {
    localAudioTrackName: string;
    localParticipantSid: string;
  }): Promise<boolean>;
  unpublishLocalVideoTrack(params: {
    localVideoTrackName: string;
    localParticipantSid: string;
  }): Promise<boolean>;
} & EventSubscriptionVendor;

export const TwilioVideo = NativeModules.TwilioVideo as TwilioVideoType;
export const TwilioVideoEventEmitter = new NativeEventEmitter(TwilioVideo);
