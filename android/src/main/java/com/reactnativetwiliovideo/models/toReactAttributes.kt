package com.reactnativetwiliovideo.models

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.twilio.video.*

fun Room.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putString("sid", sid)
  attributes.putString("name", name)
  attributes.putString("state", state.toReactState())
  attributes.putBoolean("isRecording", isRecording)
  attributes.putMap("localParticipant", localParticipant?.toReactAttributes())

  val remoteParticipantsReactAttributes = Arguments.createArray()
  remoteParticipants.map { it.toReactAttributes() }.forEach { remoteParticipantsReactAttributes.pushMap(it) }
  attributes.putArray("remoteParticipants", remoteParticipantsReactAttributes)

  attributes.putMap("dominantSpeaker", dominantSpeaker?.toReactAttributes())

  return attributes
}

fun Room.State.toReactState(): String {
  return when(this) {
    Room.State.CONNECTING -> "connecting"
    Room.State.CONNECTED -> "connected"
    Room.State.DISCONNECTED -> "disconnected"
    Room.State.RECONNECTING -> "reconnecting"
  }
}

fun LocalParticipant.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putString("identity", identity)
  attributes.putString("sid", sid)
  attributes.putString("networkQualityLevel", networkQualityLevel.toReactNetworkQualityLevel())

  val localAudioTracksReactAttributes = Arguments.createArray()
  localAudioTracks.map { it.toReactAttributes() }.forEach { localAudioTracksReactAttributes.pushMap(it) }
  attributes.putArray("localAudioTracks", localAudioTracksReactAttributes)

  val localVideoTracksReactAttributes = Arguments.createArray()
  localVideoTracks.map { it.toReactAttributes() }.forEach { localVideoTracksReactAttributes.pushMap(it) }
  attributes.putArray("localVideoTracks", localVideoTracksReactAttributes)

  val localDataTracksReactAttributes = Arguments.createArray()
  localDataTracks.map { it.toReactAttributes() }.forEach { localDataTracksReactAttributes.pushMap(it) }
  attributes.putArray("localDataTracks", localDataTracksReactAttributes)

  return attributes
}

fun NetworkQualityLevel.toReactNetworkQualityLevel(): String {
  return when(this) {
    NetworkQualityLevel.NETWORK_QUALITY_LEVEL_UNKNOWN -> "unknown"
    NetworkQualityLevel.NETWORK_QUALITY_LEVEL_ZERO -> "zero"
    NetworkQualityLevel.NETWORK_QUALITY_LEVEL_ONE -> "one"
    NetworkQualityLevel.NETWORK_QUALITY_LEVEL_TWO -> "two"
    NetworkQualityLevel.NETWORK_QUALITY_LEVEL_THREE -> "three"
    NetworkQualityLevel.NETWORK_QUALITY_LEVEL_FOUR -> "four"
    NetworkQualityLevel.NETWORK_QUALITY_LEVEL_FIVE -> "five"
  }
}

fun LocalAudioTrackPublication.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putString("trackSid", trackSid)
  attributes.putString("trackName", trackName)
  attributes.putString("priority", priority.toReactTrackPriority())
  attributes.putMap("localTrack", localAudioTrack.toReactAttributes())

  return attributes
}

fun LocalVideoTrackPublication.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putString("trackSid", trackSid)
  attributes.putString("trackName", trackName)
  attributes.putString("priority", priority.toReactTrackPriority())
  attributes.putMap("localTrack", localVideoTrack.toReactAttributes())

  return attributes
}

fun LocalDataTrackPublication.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putString("trackSid", trackSid)
  attributes.putString("trackName", trackName)
  attributes.putString("priority", priority.toReactTrackPriority())
  attributes.putMap("localTrack", localDataTrack.toReactAttributes())

  return attributes
}

private fun TrackPriority.toReactTrackPriority(): String {
  return when(this) {
    TrackPriority.LOW -> "low"
    TrackPriority.STANDARD -> "standard"
    TrackPriority.HIGH -> "high"
  }
}

fun LocalAudioTrack.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putBoolean("isEnabled", isEnabled)
  attributes.putString("name", name)

  return attributes
}

fun LocalVideoTrack.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putBoolean("isEnabled", isEnabled)
  attributes.putString("name", name)

  return attributes
}

fun LocalDataTrack.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putBoolean("isEnabled", isEnabled)
  attributes.putString("name", name)

  return attributes
}

fun RemoteParticipant.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putBoolean("connected", state == Participant.State.CONNECTED)
  attributes.putString("identity", identity)
  attributes.putString("sid", sid)
  attributes.putString("networkQualityLevel", networkQualityLevel.toReactNetworkQualityLevel())

  val remoteAudioTracksReactAttributes = Arguments.createArray()
  remoteAudioTracks.map { it.toReactAttributes() }.forEach { remoteAudioTracksReactAttributes.pushMap(it) }
  attributes.putArray("remoteAudioTracks", remoteAudioTracksReactAttributes)

  val remoteVideoTracksReactAttributes = Arguments.createArray()
  remoteVideoTracks.map { it.toReactAttributes() }.forEach { remoteVideoTracksReactAttributes.pushMap(it) }
  attributes.putArray("remoteVideoTracks", remoteVideoTracksReactAttributes)

  val remoteDataTracksReactAttributes = Arguments.createArray()
  remoteDataTracks.map { it.toReactAttributes() }.forEach { remoteDataTracksReactAttributes.pushMap(it) }
  attributes.putArray("remoteDataTracks", remoteDataTracksReactAttributes)


  return attributes
}

fun RemoteAudioTrackPublication.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putBoolean("isTrackSubscribed", isTrackSubscribed)
  attributes.putMap("remoteTrack", remoteAudioTrack?.toReactAttributes())
  attributes.putString("publishPriority", publishPriority.toReactTrackPriority())
  attributes.putBoolean("isTrackEnabled", isTrackEnabled)
  attributes.putString("trackName", trackName)
  attributes.putString("trackSid", trackSid)

  return attributes
}

fun RemoteVideoTrackPublication.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putBoolean("isTrackSubscribed", isTrackSubscribed)
  attributes.putMap("remoteTrack", remoteVideoTrack?.toReactAttributes())
  attributes.putString("publishPriority", publishPriority.toReactTrackPriority())
  attributes.putBoolean("isTrackEnabled", isTrackEnabled)
  attributes.putString("trackName", trackName)
  attributes.putString("trackSid", trackSid)

  return attributes
}

fun RemoteDataTrackPublication.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putBoolean("isTrackSubscribed", isTrackSubscribed)
  attributes.putMap("remoteTrack", remoteDataTrack?.toReactAttributes())
  attributes.putString("publishPriority", publishPriority.toReactTrackPriority())
  attributes.putBoolean("isTrackEnabled", isTrackEnabled)
  attributes.putString("trackName", trackName)
  attributes.putString("trackSid", trackSid)

  return attributes
}

fun RemoteAudioTrack.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putBoolean("isPlaybackEnabled", isPlaybackEnabled)
  attributes.putString("sid", sid)
  attributes.putBoolean("isEnabled", isEnabled)
  attributes.putString("name", name)

  return attributes
}

fun RemoteVideoTrack.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putString("sid", sid)
  attributes.putBoolean("isEnabled", isEnabled)
  attributes.putString("name", name)
  attributes.putBoolean("isSwitchedOff", isSwitchedOff)
  attributes.putString("priority", priority?.toReactTrackPriority())

  return attributes
}


fun RemoteDataTrack.toReactAttributes(): WritableMap {
  val attributes = Arguments.createMap()

  attributes.putString("sid", sid)
  attributes.putBoolean("isEnabled", isEnabled)
  attributes.putString("name", name)

  return attributes
}
