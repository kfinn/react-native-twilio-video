package com.reactnativetwiliovideo.models

import android.content.Context
import com.twilio.video.LocalAudioTrack
import com.twilio.video.LocalVideoTrack
import com.twilio.video.Room
import com.twilio.video.Video

interface TwilioVideoSDKReactDataSource {
  fun findLocalVideoTrack(name: String): LocalVideoTrack?
  fun findLocalAudioTrack(name: String): LocalAudioTrack?
}

fun connectFromReact(context: Context, token: String, connectOptionsParams: ConnectOptionsParams, roomListener: Room.Listener, dataSource: TwilioVideoSDKReactDataSource): Room {
  return Video.connect(
    context,
    connectOptionsParams.toConnectOptions(token, dataSource),
    roomListener
  )
}
