package com.reactnativetwiliovideo.models

import com.twilio.video.VideoDimensions
import com.twilio.video.VideoFormat

data class LocalVideoTrackCreateParams(
  val enabled: Boolean? = null,
  val name: String? = null,
  val deviceName: String? = null,
  val format: FormatParams? = null
) {
  data class FormatParams(
    val dimensions: DimensionsParams,
    val framerate: Int
  ) {
    data class DimensionsParams(
      val width: Int,
      val height: Int
    ) {
      fun toVideoDimensions(): VideoDimensions {
        return VideoDimensions(width, height)
      }
    }

    fun toVideoFormat(): VideoFormat {
      return VideoFormat(dimensions.toVideoDimensions(), framerate)
    }
  }
}
