package com.reactnativetwiliovideo.models

import com.twilio.video.LocalAudioTrack
import com.twilio.video.LocalVideoTrack

fun LocalAudioTrack.destroyFromReact() {
  release()
}

fun LocalVideoTrack.destroyFromReact() {
  release()
}
