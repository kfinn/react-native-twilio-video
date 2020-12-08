import React from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';
import type RemoteVideoTrack from '../models/RemoteVideoTrack';

const NativeRemoteVideoTrackView = requireNativeComponent<
  { sid: string } & RemotelVideoTrackViewCommonProps
>('RemoteVideoTrackView');

interface RemotelVideoTrackViewCommonProps extends ViewProps {
  scaleType?: 'aspectFill' | 'aspectFit';
}

interface RemoteVideoTrackViewPropsBySid {
  sid: string;
}

interface RemoteVideoTrackViewPropsByModel {
  remoteVideoTrack: RemoteVideoTrack;
}

type RemoteVideoTrackViewProps = (
  | RemoteVideoTrackViewPropsBySid
  | RemoteVideoTrackViewPropsByModel
) &
  RemotelVideoTrackViewCommonProps;

export default function RemoteVideoTrackView(props: RemoteVideoTrackViewProps) {
  const {
    sid: optionalSid,
    remoteVideoTrack,
    scaleType,
    ...viewProps
  } = props as RemoteVideoTrackViewPropsBySid &
    RemoteVideoTrackViewPropsByModel &
    RemotelVideoTrackViewCommonProps;

  const sid = optionalSid ?? remoteVideoTrack?.sid;

  if (!sid) {
    throw 'must specify sid or remoteVideoTrack';
  }

  return (
    <NativeRemoteVideoTrackView
      sid={sid}
      scaleType={scaleType}
      {...viewProps}
    />
  );
}
