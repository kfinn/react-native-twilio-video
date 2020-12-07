package com.reactnativetwiliovideo.views

import android.content.Context
import com.twilio.video.VideoTrack
import com.twilio.video.VideoView

class VideoTrackView(context: Context): VideoView(context) {
  var videoTrack: VideoTrack? = null
    set(value) {
      field?.removeSink(this)
      field = value
      value?.addSink(this)
    }
}
