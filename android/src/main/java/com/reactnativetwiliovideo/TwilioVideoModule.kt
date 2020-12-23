package com.reactnativetwiliovideo

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.google.gson.Gson
import com.reactnativetwiliovideo.models.*
import com.twilio.video.*
import java.util.logging.Logger


@ReactModule(name = "TwilioVideo")
class TwilioVideoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), Room.Listener, LocalParticipant.Listener, RemoteParticipant.Listener, TwilioVideoSDKReactDataSource {
  override fun getName(): String {
    return "TwilioVideo"
  }

  private val logger = Logger.getLogger("TwilioVideoModule")
  private val gson = Gson()

  private val rooms = mutableListOf<Room>()
  private val localAudioTracksByName = mutableMapOf<String, LocalAudioTrack>()
  private val localVideoTracksByName = mutableMapOf<String, LocalVideoTrack>()

  private fun findRoom(sid: String): Room? {
    return rooms.find { it.sid == sid }
  }

  override fun findLocalAudioTrack(name: String): LocalAudioTrack? {
    return localAudioTracksByName[name]
  }

  override fun findLocalVideoTrack(name: String): LocalVideoTrack? {
    return localVideoTracksByName[name]
  }

  private val remoteParticipants: List<RemoteParticipant>
    get() = rooms.flatMap { it.remoteParticipants }
  private val remoteAudioTrackPublications: List<RemoteAudioTrackPublication>
    get() = remoteParticipants.flatMap { it.remoteAudioTracks }
  private val remoteAudioTracks: List<RemoteAudioTrack>
    get() = remoteAudioTrackPublications.mapNotNull { it.remoteAudioTrack }

  private fun findRemoteAudioTrack(sid: String): RemoteAudioTrack? {
    return remoteAudioTracks.find { it.sid == sid }
  }

  private val remoteVideoTrackPublications: List<RemoteVideoTrackPublication>
    get() = remoteParticipants.flatMap { it.remoteVideoTracks }
  private val remoteVideoTracks: List<RemoteVideoTrack>
    get() = remoteVideoTrackPublications.mapNotNull { it.remoteVideoTrack }

  fun findRemoteVideoTrack(sid: String): RemoteVideoTrack? {
    return remoteVideoTracks.find { it.sid == sid }
  }

  private val localParticipants: List<LocalParticipant>
    get() = rooms.mapNotNull { it.localParticipant }

  private fun findLocalParticipant(sid: String): LocalParticipant? {
    return localParticipants.find { it.sid == sid }
  }

  @ReactMethod
  fun connect(
    token: String,
    options: ReadableMap,
    promise: Promise
  ) {
    try {
      val connectOptionsParams = gson.fromJson(gson.toJsonTree(options.toPlainCollection()), ConnectOptionsParams::class.java)
      val room = connectFromReact(
        reactApplicationContext,
        token,
        connectOptionsParams,
        this,
        this
      )
      rooms.add(room)
      promise.resolve(room.toReactAttributes())
    } catch (exception: Exception) {
      promise.reject("422", "Unable to connect", exception)
    }
  }


  @ReactMethod
  fun disconnect(sid: String, promise: Promise) {
    val room = findRoom(sid)
    if (room != null) {
      room.disconnect()
      rooms.removeAll { it.sid == sid }
      promise.resolve(true)
    } else {
      promise.reject("404", "Room not found", null)
    }
  }

  @ReactMethod
  fun updateLocalAudioTrack(name: String, params: ReadableMap, promise: Promise) {
    val localAudioTrack = findLocalAudioTrack(name)
    if (localAudioTrack != null) {
      try {
        val localAudioTrackUpdateParams = gson.fromJson(gson.toJsonTree(params.toPlainCollection()), LocalAudioTrackUpdateParams::class.java)
        localAudioTrack.updateFromReact(localAudioTrackUpdateParams)
        promise.resolve(true)
      } catch (exception: Exception) {
        promise.reject("422", "Unable to update local audio track", exception)
      }
    } else {
      promise.reject("404", "LocalAudioTrack not found", null)
    }
  }

  @ReactMethod
  fun updateLocalVideoTrack(name: String, params: ReadableMap, promise: Promise) {
    val localVideoTrack = findLocalVideoTrack(name)
    if (localVideoTrack != null) {
      try {
        val localVideoTrackUpdateParams = gson.fromJson(gson.toJsonTree(params.toPlainCollection()), LocalVideoTrackUpdateParams::class.java)
        localVideoTrack.updateFromReact(localVideoTrackUpdateParams)
        promise.resolve(true)
      } catch (exception: Exception) {
        promise.reject("422", "Unable to update local video track", exception)
      }
    } else {
      promise.reject("404", "LocalVideoTrack not found", null)
    }
  }

  @ReactMethod
  fun updateRemoteAudioTrack(sid: String, params: ReadableMap, promise: Promise) {
    val remoteAudioTrack = findRemoteAudioTrack(sid)
    if (remoteAudioTrack != null) {
      try {
        val remoteAudioTrackUpdateParams = gson.fromJson(gson.toJsonTree(params.toPlainCollection()), RemoteAudioTrackUpdateParams::class.java)
        remoteAudioTrack.updateFromReact(remoteAudioTrackUpdateParams)
        promise.resolve(true)
      } catch (exception: Exception) {
        promise.reject("422", "Unable to update remote audio track", exception)
      }
    } else {
      promise.reject("404", "RemoteAudioTrack not found", null)
    }
  }

  @ReactMethod
  fun createLocalAudioTrack(params: ReadableMap, promise: Promise) {
    try {
      val localAudioTrackCreateParams = gson.fromJson(gson.toJsonTree(params.toPlainCollection()), LocalAudioTrackCreateParams::class.java)
      val name = localAudioTrackCreateParams.name
      if (name != null) {
        if (localAudioTracksByName.keys.contains(name)) {
          promise.reject("422", "Duplicate track name")
          return
        }
      }
      val localAudioTrack = createLocalAudioTrackFromReact(reactApplicationContext, localAudioTrackCreateParams)
      if (localAudioTrack == null) {
        promise.reject("422", "Unable to create local audio track")
        return
      }
      localAudioTracksByName[localAudioTrack.name] = localAudioTrack
      promise.resolve(localAudioTrack.toReactAttributes())
    } catch (exception: Exception) {
      logger.severe(exception.localizedMessage)
      promise.reject("422", "Unable to create local audio track", exception)
    }
  }

  @ReactMethod
  fun createLocalVideoTrack(params: ReadableMap, promise: Promise) {
    try {
      val localVideoTrackCreateParams = gson.fromJson(gson.toJsonTree(params.toPlainCollection()), LocalVideoTrackCreateParams::class.java)
      val name = localVideoTrackCreateParams.name
      if (name != null) {
        if (localVideoTracksByName.keys.contains(name)) {
          promise.reject("422", "Duplicate track name")
          return
        }
      }
      val localVideoTrack = createLocalVideoTrackFromReact(reactApplicationContext, localVideoTrackCreateParams)
      if (localVideoTrack == null) {
        promise.reject("422", "Unable to create local video track")
        return
      }
      localVideoTracksByName[localVideoTrack.name] = localVideoTrack
      promise.resolve(localVideoTrack.toReactAttributes())
    } catch (exception: Exception) {
      logger.severe(exception.localizedMessage)
      promise.reject("422", "Unable to create local video track", exception)
    }
  }

  @ReactMethod
  fun destroyLocalAudioTrack(name: String, promise: Promise) {
    val localAudioTrack = findLocalAudioTrack(name)
    if (localAudioTrack != null) {
      localParticipants.forEach { localParticipant ->
        if (localParticipant.localAudioTracks.any { it.localAudioTrack == localAudioTrack }) {
          localParticipant.unpublishTrack(localAudioTrack)
        }
      }
      localAudioTrack.destroyFromReact()
      localAudioTracksByName.remove(name)
      promise.resolve(true)
    } else {
      promise.reject("404", "Local video track not found", null)
    }
  }

  @ReactMethod
  fun destroyLocalVideoTrack(name: String, promise: Promise) {
    val localVideoTrack = findLocalVideoTrack(name)
    if (localVideoTrack != null) {
      localParticipants.forEach { localParticipant ->
        if (localParticipant.localVideoTracks.any { it.localVideoTrack == localVideoTrack }) {
          localParticipant.unpublishTrack(localVideoTrack)
        }
      }

      localVideoTrack.destroyFromReact()
    } else {
      promise.reject("404", "Local video track not found", null)
    }
  }

  @ReactMethod
  fun publishLocalAudioTrack(params: ReadableMap, promise: Promise) {
    val localAudioTrackName = params.getString("localAudioTrackName")
    val localParticipantSid = params.getString("localParticipantSid")
    if (localAudioTrackName == null || localParticipantSid == null) {
      promise.reject("404", "Local audio track or participant not found", null)
      return
    }
    val localAudioTrack = findLocalAudioTrack(localAudioTrackName)
    val localParticipant = findLocalParticipant(localParticipantSid)
    if (localAudioTrack == null || localParticipant == null) {
      promise.reject("404", "Local audio track or participant not found", null)
      return
    }
    promise.resolve(localParticipant.publishTrack(localAudioTrack))
  }

  @ReactMethod
  fun publishLocalVideoTrack(params: ReadableMap, promise: Promise) {
    val localVideoTrackName = params.getString("localVideoTrackName")
    val localParticipantSid = params.getString("localParticipantSid")
    if (localVideoTrackName == null || localParticipantSid == null) {
      promise.reject("404", "Local video track or participant not found", null)
      return
    }
    val localVideoTrack = findLocalVideoTrack(localVideoTrackName)
    val localParticipant = findLocalParticipant(localParticipantSid)
    if (localVideoTrack == null || localParticipant == null) {
      promise.reject("404", "Local video track or participant not found", null)
      return
    }
    promise.resolve(localParticipant.publishTrack(localVideoTrack))
  }

  @ReactMethod
  fun unpublishLocalAudioTrack(params: ReadableMap, promise: Promise) {
    val localAudioTrackName = params.getString("localAudioTrackName")
    val localParticipantSid = params.getString("localParticipantSid")
    if (localAudioTrackName == null || localParticipantSid == null) {
      promise.reject("404", "Local audio track or participant not found", null)
      return
    }
    val localAudioTrack = findLocalAudioTrack(localAudioTrackName)
    val localParticipant = findLocalParticipant(localParticipantSid)
    if (localAudioTrack == null || localParticipant == null) {
      promise.reject("404", "Local audio track or participant not found", null)
      return
    }
    promise.resolve(localParticipant.unpublishTrack(localAudioTrack))
  }

  @ReactMethod
  fun unpublishLocalVideoTrack(params: ReadableMap, promise: Promise) {
    val localVideoTrackName = params.getString("localVideoTrackName")
    val localParticipantSid = params.getString("localParticipantSid")
    if (localVideoTrackName == null || localParticipantSid == null) {
      promise.reject("404", "Local video track or participant not found", null)
      return
    }
    val localVideoTrack = findLocalVideoTrack(localVideoTrackName)
    val localParticipant = findLocalParticipant(localParticipantSid)
    if (localVideoTrack == null || localParticipant == null) {
      promise.reject("404", "Local video track or participant not found", null)
      return
    }
    promise.resolve(localParticipant.unpublishTrack(localVideoTrack))
  }

  private fun sendEvent(eventName: String, data: ReadableMap) {
    this
      .reactApplicationContext
      .getJSModule(RCTDeviceEventEmitter::class.java)
      .emit(eventName, data)
  }

  override fun onConnected(room: Room) {
    room.localParticipant!!.setListener(this)
    room.remoteParticipants.forEach { it.setListener(this) }

    val attributes = Arguments.createMap()
    attributes.putMap("room", room.toReactAttributes())
    sendEvent("Room.connected", attributes)
  }

  override fun onConnectFailure(room: Room, twilioException: TwilioException) {
    val attributes = Arguments.createMap()
    attributes.putMap("room", room.toReactAttributes())
    attributes.putString("error", twilioException.localizedMessage)
    sendEvent("Room.connectFailure", attributes)
  }

  override fun onReconnecting(room: Room, twilioException: TwilioException) {
    val attributes = Arguments.createMap()
    attributes.putMap("room", room.toReactAttributes())
    attributes.putString("error", twilioException.localizedMessage)
    sendEvent("Room.reconnecting", attributes)
  }

  override fun onReconnected(room: Room) {
    val attributes = Arguments.createMap()
    attributes.putMap("room", room.toReactAttributes())
    sendEvent("Room.reconnected", attributes)
  }

  override fun onDisconnected(room: Room, twilioException: TwilioException?) {
    val attributes = Arguments.createMap()
    attributes.putMap("room", room.toReactAttributes())
    attributes.putString("error", twilioException?.localizedMessage)
    sendEvent("Room.disconnected", attributes)
  }

  override fun onParticipantConnected(room: Room, remoteParticipant: RemoteParticipant) {
    remoteParticipant.setListener(this)

    val attributes = Arguments.createMap()
    attributes.putMap("room", room.toReactAttributes())
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    sendEvent("Room.participantConnected", attributes)
  }

  override fun onParticipantDisconnected(room: Room, remoteParticipant: RemoteParticipant) {
    val attributes = Arguments.createMap()
    attributes.putMap("room", room.toReactAttributes())
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    sendEvent("Room.participantDisconnected", attributes)
  }

  override fun onRecordingStarted(room: Room) {
    val attributes = Arguments.createMap()
    attributes.putMap("room", room.toReactAttributes())
    sendEvent("Room.recordingStarted", attributes)
  }

  override fun onRecordingStopped(room: Room) {
    val attributes = Arguments.createMap()
    attributes.putMap("room", room.toReactAttributes())
    sendEvent("Room.recordingStopped", attributes)
  }

  override fun onAudioTrackPublished(localParticipant: LocalParticipant, localAudioTrackPublication: LocalAudioTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", localParticipant.toReactAttributes())
    attributes.putMap("audioTrackPublication", localAudioTrackPublication.toReactAttributes())
    sendEvent("LocalParticipant.audioTrackPublished", attributes)
  }

  override fun onAudioTrackPublicationFailed(localParticipant: LocalParticipant, localAudioTrack: LocalAudioTrack, twilioException: TwilioException) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", localParticipant.toReactAttributes())
    attributes.putMap("audioTrack", localAudioTrack.toReactAttributes())
    attributes.putString("error", twilioException.localizedMessage)
    sendEvent("LocalParticipant.audioTrackPublicationFailed", attributes)
  }

  override fun onVideoTrackPublished(localParticipant: LocalParticipant, localVideoTrackPublication: LocalVideoTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", localParticipant.toReactAttributes())
    attributes.putMap("videoTrackPublication", localVideoTrackPublication.toReactAttributes())
    sendEvent("LocalParticipant.videoTrackPublished", attributes)
  }

  override fun onVideoTrackPublicationFailed(localParticipant: LocalParticipant, localVideoTrack: LocalVideoTrack, twilioException: TwilioException) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", localParticipant.toReactAttributes())
    attributes.putMap("videoTrack", localVideoTrack.toReactAttributes())
    attributes.putString("error", twilioException.localizedMessage)
    sendEvent("LocalParticipant.videoTrackPublicationFailed", attributes)
  }

  override fun onDataTrackPublished(localParticipant: LocalParticipant, localDataTrackPublication: LocalDataTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", localParticipant.toReactAttributes())
    attributes.putMap("dataTrackPublication", localDataTrackPublication.toReactAttributes())
    sendEvent("LocalParticipant.dataTrackPublished", attributes)
  }

  override fun onDataTrackPublicationFailed(localParticipant: LocalParticipant, localDataTrack: LocalDataTrack, twilioException: TwilioException) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", localParticipant.toReactAttributes())
    attributes.putMap("dataTrack", localDataTrack.toReactAttributes())
    attributes.putString("error", twilioException.localizedMessage)
    sendEvent("LocalParticipant.dataTrackPublicationFailed", attributes)
  }

  override fun onAudioTrackPublished(remoteParticipant: RemoteParticipant, remoteAudioTrackPublication: RemoteAudioTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteAudioTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.audioTrackPublished", attributes)
  }

  override fun onAudioTrackUnpublished(remoteParticipant: RemoteParticipant, remoteAudioTrackPublication: RemoteAudioTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteAudioTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.audioTrackUnpublished", attributes)
  }

  override fun onAudioTrackSubscribed(remoteParticipant: RemoteParticipant, remoteAudioTrackPublication: RemoteAudioTrackPublication, remoteAudioTrack: RemoteAudioTrack) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteAudioTrackPublication.toReactAttributes())
    attributes.putMap("audioTrack", remoteAudioTrack.toReactAttributes())
    sendEvent("RemoteParticipant.audioTrackSubscribed", attributes)
  }

  override fun onAudioTrackSubscriptionFailed(remoteParticipant: RemoteParticipant, remoteAudioTrackPublication: RemoteAudioTrackPublication, twilioException: TwilioException) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteAudioTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.audioTrackSubscriptionFailed", attributes)
    attributes.putString("error", twilioException.localizedMessage)
  }

  override fun onAudioTrackUnsubscribed(remoteParticipant: RemoteParticipant, remoteAudioTrackPublication: RemoteAudioTrackPublication, remoteAudioTrack: RemoteAudioTrack) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteAudioTrackPublication.toReactAttributes())
    attributes.putMap("audioTrack", remoteAudioTrack.toReactAttributes())
    sendEvent("RemoteParticipant.audioTrackUnsubscribed", attributes)
  }

  override fun onVideoTrackPublished(remoteParticipant: RemoteParticipant, remoteVideoTrackPublication: RemoteVideoTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteVideoTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.videoTrackPublished", attributes)
  }

  override fun onVideoTrackUnpublished(remoteParticipant: RemoteParticipant, remoteVideoTrackPublication: RemoteVideoTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteVideoTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.videoTrackUnpublished", attributes)
  }

  override fun onVideoTrackSubscribed(remoteParticipant: RemoteParticipant, remoteVideoTrackPublication: RemoteVideoTrackPublication, remoteVideoTrack: RemoteVideoTrack) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteVideoTrackPublication.toReactAttributes())
    attributes.putMap("videoTrack", remoteVideoTrack.toReactAttributes())
    sendEvent("RemoteParticipant.videoTrackSubscribed", attributes)
  }

  override fun onVideoTrackSubscriptionFailed(remoteParticipant: RemoteParticipant, remoteVideoTrackPublication: RemoteVideoTrackPublication, twilioException: TwilioException) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteVideoTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.videoTrackSubscriptionFailed", attributes)
    attributes.putString("error", twilioException.localizedMessage)
  }

  override fun onVideoTrackUnsubscribed(remoteParticipant: RemoteParticipant, remoteVideoTrackPublication: RemoteVideoTrackPublication, remoteVideoTrack: RemoteVideoTrack) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteVideoTrackPublication.toReactAttributes())
    attributes.putMap("videoTrack", remoteVideoTrack.toReactAttributes())
    sendEvent("RemoteParticipant.videoTrackUnsubscribed", attributes)
  }

  override fun onDataTrackPublished(remoteParticipant: RemoteParticipant, remoteDataTrackPublication: RemoteDataTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteDataTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.dataTrackPublished", attributes)
  }

  override fun onDataTrackUnpublished(remoteParticipant: RemoteParticipant, remoteDataTrackPublication: RemoteDataTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteDataTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.dataTrackUnpublished", attributes)
  }

  override fun onDataTrackSubscribed(remoteParticipant: RemoteParticipant, remoteDataTrackPublication: RemoteDataTrackPublication, remoteDataTrack: RemoteDataTrack) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteDataTrackPublication.toReactAttributes())
    attributes.putMap("dataTrack", remoteDataTrack.toReactAttributes())
    sendEvent("RemoteParticipant.dataTrackSubscribed", attributes)
  }

  override fun onDataTrackSubscriptionFailed(remoteParticipant: RemoteParticipant, remoteDataTrackPublication: RemoteDataTrackPublication, twilioException: TwilioException) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteDataTrackPublication.toReactAttributes())
    attributes.putString("error", twilioException.localizedMessage)
    sendEvent("RemoteParticipant.dataTrackSubscriptionFailed", attributes)
  }

  override fun onDataTrackUnsubscribed(remoteParticipant: RemoteParticipant, remoteDataTrackPublication: RemoteDataTrackPublication, remoteDataTrack: RemoteDataTrack) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteDataTrackPublication.toReactAttributes())
    attributes.putMap("dataTrack", remoteDataTrack.toReactAttributes())
    sendEvent("RemoteParticipant.dataTrackUnsubscribed", attributes)
  }

  override fun onAudioTrackEnabled(remoteParticipant: RemoteParticipant, remoteAudioTrackPublication: RemoteAudioTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteAudioTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.audioTrackEnabled", attributes)
  }

  override fun onAudioTrackDisabled(remoteParticipant: RemoteParticipant, remoteAudioTrackPublication: RemoteAudioTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteAudioTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.audioTrackDisabled", attributes)
  }

  override fun onVideoTrackEnabled(remoteParticipant: RemoteParticipant, remoteVideoTrackPublication: RemoteVideoTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteVideoTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.videoTrackEnabled", attributes)
  }

  override fun onVideoTrackDisabled(remoteParticipant: RemoteParticipant, remoteVideoTrackPublication: RemoteVideoTrackPublication) {
    val attributes = Arguments.createMap()
    attributes.putMap("participant", remoteParticipant.toReactAttributes())
    attributes.putMap("publication", remoteVideoTrackPublication.toReactAttributes())
    sendEvent("RemoteParticipant.videoTrackDisabled", attributes)
  }
}
