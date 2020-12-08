package com.reactnativetwiliovideo.views

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.reactnativetwiliovideo.TwilioVideoModule
import com.reactnativetwiliovideo.models.videoScaleTypeFromReactScaleType
import com.twilio.video.VideoScaleType
import java.util.logging.Logger

class LocalVideoTrackViewManager(private val context: ReactApplicationContext) : SimpleViewManager<VideoTrackView>() {
  override fun getName(): String {
    return "LocalVideoTrackView"
  }

  override fun createViewInstance(reactContext: ThemedReactContext): VideoTrackView {
    return VideoTrackView(reactContext)
  }

  @ReactProp(name = "name")
  fun setName(view: VideoTrackView, name: String?) {
    val localVideoTrack = if (name != null) context.getNativeModule(TwilioVideoModule::class.java).findLocalVideoTrack(name) else null
    view.videoTrack = localVideoTrack
  }

  @ReactProp(name = "scaleType")
  fun setScaleType(view: VideoTrackView, scaleType: String?) {
    view.videoScaleType = videoScaleTypeFromReactScaleType(scaleType) ?: VideoScaleType.ASPECT_FIT
  }
}
