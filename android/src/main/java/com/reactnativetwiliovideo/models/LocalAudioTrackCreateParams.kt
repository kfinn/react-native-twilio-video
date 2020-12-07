package com.reactnativetwiliovideo.models

import com.twilio.video.AudioOptions

data class LocalAudioTrackCreateParams(
  val options: LocalAudioTrackCreateOptionsParams? = null,
  val enabled: Boolean = true,
  val name: String? = null
) {
  data class LocalAudioTrackCreateOptionsParams(
    val audioJitterBufferFastAccelerate: Boolean? = null,
    val autoGainControl: Boolean? = null,
    val echoCancellation: Boolean? = null,
    val highpassFilter: Boolean? = null,
    val noiseSuppression: Boolean? = null,
    val stereoSwapping: Boolean? = null,
    val typingDetection: Boolean? = null
  ) {
    fun toAudioOptions(): AudioOptions {
      val audioOptionsBuilder = AudioOptions.Builder()

      if (audioJitterBufferFastAccelerate != null) {
        audioOptionsBuilder.audioJitterBufferFastAccelerate(audioJitterBufferFastAccelerate)
      }

      if (autoGainControl != null) {
        audioOptionsBuilder.autoGainControl(autoGainControl)
      }

      if (echoCancellation != null) {
        audioOptionsBuilder.echoCancellation(echoCancellation)
      }

      if (highpassFilter != null) {
        audioOptionsBuilder.highpassFilter(highpassFilter)
      }

      if (noiseSuppression != null) {
        audioOptionsBuilder.noiseSuppression(noiseSuppression)
      }

      if (stereoSwapping != null) {
        audioOptionsBuilder.stereoSwapping(stereoSwapping)
      }

      if (typingDetection != null) {
        audioOptionsBuilder.typingDetection(typingDetection)
      }

      return audioOptionsBuilder.build()
    }
  }
}
