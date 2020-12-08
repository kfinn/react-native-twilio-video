import React from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';
import type LocalVideoTrack from '../models/LocalVideoTrack';

const NativeLocalVideoTrackView = requireNativeComponent<
  { name: string } & LocalVideoTrackViewCommonProps
>('LocalVideoTrackView');

interface LocalVideoTrackViewCommonProps extends ViewProps {
  scaleType?: 'aspectFill' | 'aspectFit';
}

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
  LocalVideoTrackViewCommonProps;

export default function LocalVideoTrackView(props: LocalVideoTrackViewProps) {
  const {
    name: optionalName,
    localVideoTrack,
    scaleType,
    ...viewProps
  } = props as LocalVideoTrackViewPropsByName &
    LocalVideoTrackViewPropsByModel &
    LocalVideoTrackViewCommonProps;

  const name = optionalName ?? localVideoTrack?.name;

  if (!name) {
    throw 'must specify name or localVideoTrack';
  }

  return (
    <NativeLocalVideoTrackView
      name={name}
      scaleType={scaleType}
      {...viewProps}
    />
  );
}
