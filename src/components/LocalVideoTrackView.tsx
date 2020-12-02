import React from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';
import type LocalVideoTrack from '../models/LocalVideoTrack';

const NativeLocalVideoTrackView = requireNativeComponent<
  { name: string } & ViewProps
>('LocalVideoTrackView');

interface LocalVideoTrackViewPropsByName {
  name: string;
}

interface LocalVideoTrackViewPropsByModel {
  localVideoTrack: LocalVideoTrack;
}

type LocalVideoTrackViewProps = (
  | LocalVideoTrackViewPropsByName
  | LocalVideoTrackViewPropsByModel
) &
  ViewProps;

export default function LocalVideoTrackView(props: LocalVideoTrackViewProps) {
  const {
    name: optionalName,
    localVideoTrack,
    ...viewProps
  } = props as LocalVideoTrackViewPropsByName &
    LocalVideoTrackViewPropsByModel &
    ViewProps;

  const name = optionalName ?? localVideoTrack?.name;

  if (!name) {
    throw 'must specify name or localVideoTrack';
  }

  return <NativeLocalVideoTrackView name={name} {...viewProps} />;
}
