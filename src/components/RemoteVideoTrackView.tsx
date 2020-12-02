import React from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';
import type RemoteVideoTrack from '../models/RemoteVideoTrack';

const NativeRemoteVideoTrackView = requireNativeComponent<
  { sid: string } & ViewProps
>('RemoteVideoTrackView');

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
  ViewProps;

export default function RemoteVideoTrackView(props: RemoteVideoTrackViewProps) {
  const {
    sid: optionalSid,
    remoteVideoTrack,
    ...viewProps
  } = props as RemoteVideoTrackViewPropsBySid &
    RemoteVideoTrackViewPropsByModel &
    ViewProps;

  const sid = optionalSid ?? remoteVideoTrack?.sid;

  if (!sid) {
    throw 'must specify sid or remoteVideoTrack';
  }

  return <NativeRemoteVideoTrackView sid={sid} {...viewProps} />;
}
