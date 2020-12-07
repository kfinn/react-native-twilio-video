package com.reactnativetwiliovideo.models

import com.twilio.video.LocalAudioTrack
import com.twilio.video.LocalVideoTrack
import com.twilio.video.RemoteAudioTrack

fun LocalAudioTrack.updateFromReact(localAudioTrackUpdateParams: LocalAudioTrackUpdateParams) {
  if (localAudioTrackUpdateParams.enabled != null) {
    this.enable(localAudioTrackUpdateParams.enabled)
  }
}

fun LocalVideoTrack.updateFromReact(localVideoTrackUpdateParams: LocalVideoTrackUpdateParams) {
  if (localVideoTrackUpdateParams.enabled != null) {
    this.enable(localVideoTrackUpdateParams.enabled)
  }
}

fun RemoteAudioTrack.updateFromReact(remoteAudioTrackUpdateParams: RemoteAudioTrackUpdateParams) {
  if (remoteAudioTrackUpdateParams.isPlaybackEnabled != null) {
    this.enablePlayback(remoteAudioTrackUpdateParams.isPlaybackEnabled)
  }
}
