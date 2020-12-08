package com.reactnativetwiliovideo.models

import com.twilio.video.Video
import com.twilio.video.VideoScaleType

fun videoScaleTypeFromReactScaleType(reactScaleType: String?): VideoScaleType? {
  return when(reactScaleType) {
    "aspectFill" -> VideoScaleType.ASPECT_FILL
    "aspectFit" -> VideoScaleType.ASPECT_FIT
    else -> null
  }
}
