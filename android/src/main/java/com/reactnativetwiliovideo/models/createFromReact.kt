package com.reactnativetwiliovideo.models

import android.content.Context
import com.twilio.video.AudioOptions
import com.twilio.video.CameraCapturer
import com.twilio.video.LocalAudioTrack
import com.twilio.video.LocalVideoTrack
import tvi.webrtc.Camera1Enumerator
import java.util.logging.Logger

fun createLocalAudioTrackFromReact(context: Context, localAudioTrackCreateParams: LocalAudioTrackCreateParams): LocalAudioTrack? {
  val audioOptions = localAudioTrackCreateParams.options?.toAudioOptions()
    ?: AudioOptions.Builder().build()
  return LocalAudioTrack.create(
    context,
    localAudioTrackCreateParams.enabled,
    audioOptions,
    localAudioTrackCreateParams.name
  )
}

fun createLocalVideoTrackFromReact(context: Context, localVideoTrackCreateParams: LocalVideoTrackCreateParams): LocalVideoTrack? {
  val camera1Enumerator = Camera1Enumerator()
  val frontFacingCameraName = camera1Enumerator.deviceNames.first { camera1Enumerator.isFrontFacing(it) }

  return LocalVideoTrack.create(
    context,
    localVideoTrackCreateParams.enabled ?: true,
    CameraCapturer(
      context,
      localVideoTrackCreateParams.deviceName ?: frontFacingCameraName
    ),
    localVideoTrackCreateParams.format?.toVideoFormat() ?: null,
    localVideoTrackCreateParams.name
  )
}
