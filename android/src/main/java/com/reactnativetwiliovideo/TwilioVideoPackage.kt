package com.reactnativetwiliovideo

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.reactnativetwiliovideo.views.LocalVideoTrackViewManager
import com.reactnativetwiliovideo.views.RemoteVideoTrackViewManager

class TwilioVideoPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf<NativeModule>(TwilioVideoModule(reactContext))
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(LocalVideoTrackViewManager(reactContext), RemoteVideoTrackViewManager(reactContext))
  }
}
