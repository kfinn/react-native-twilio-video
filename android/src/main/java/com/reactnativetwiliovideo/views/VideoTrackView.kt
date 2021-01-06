package com.reactnativetwiliovideo.views

import android.content.Context
import android.widget.LinearLayout
import com.twilio.video.VideoScaleType
import com.twilio.video.VideoTrack
import com.twilio.video.VideoTextureView
import java.util.logging.Logger

class VideoTrackView(context: Context): LinearLayout(context) {
  private val videoView = VideoTextureView(context)

  init {
    addView(videoView)
  }

  var videoTrack: VideoTrack? = null
    set(value) {
      val oldValue = field

      if (oldValue != value) {
        if (oldValue != null && oldValue.sinks.contains(videoView)) {
          oldValue.removeSink(videoView)
        }
        value?.addSink(videoView)
      }

      field = value
    }

  var videoScaleType: VideoScaleType
    get() = videoView.videoScaleType
    set(value) {
      videoView.videoScaleType = value
    }

  var mirror: Boolean
    get() = videoView.mirror
    set(value) {
      videoView.mirror = value
    }
}
