package com.reactnativetwiliovideo.views

import android.content.Context
import android.view.View
import android.widget.LinearLayout
import com.twilio.video.VideoScaleType
import com.twilio.video.VideoTrack
import com.twilio.video.VideoView
import java.util.logging.Logger

class VideoTrackView(context: Context): LinearLayout(context) {
  private val videoView = VideoView(context)

  init {
    addView(videoView)
  }

  var videoTrack: VideoTrack? = null
    set(value) {
      field?.removeSink(videoView)
      field = value
      value?.addSink(videoView)
    }

  var videoScaleType: VideoScaleType
    get() = videoView.videoScaleType
    set(value) {
      videoView.videoScaleType = value
    }
}
