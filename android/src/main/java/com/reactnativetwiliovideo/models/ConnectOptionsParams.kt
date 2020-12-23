package com.reactnativetwiliovideo.models

import com.twilio.video.*
import java.lang.Exception

class InvalidNetworkQualityVerbosityException : Exception()

fun networkQualityVerbosityFromReactNetworkQualityVerbosity(reactNetworkQualityVerbosity: String): NetworkQualityVerbosity {
  return when (reactNetworkQualityVerbosity) {
    "minimal" -> NetworkQualityVerbosity.NETWORK_QUALITY_VERBOSITY_MINIMAL
    "none" -> NetworkQualityVerbosity.NETWORK_QUALITY_VERBOSITY_NONE
    else -> throw InvalidNetworkQualityVerbosityException()
  }
}

class InvalidBandwidthProfileModeException : Exception()

fun bandwidthProfileModeFromReactBandwidthProfileMode(reactBandwidthProfileMode: String): BandwidthProfileMode {
  return when (reactBandwidthProfileMode) {
    "grid" -> BandwidthProfileMode.GRID
    "collaboration" -> BandwidthProfileMode.COLLABORATION
    "presentation" -> BandwidthProfileMode.PRESENTATION
    else -> throw InvalidBandwidthProfileModeException()
  }
}

class InvalidTrackPriorityException : Exception()

fun trackPriorityFromReactTrackPriority(reactTrackPriority: String): TrackPriority {
  return when (reactTrackPriority) {
    "low" -> TrackPriority.LOW
    "standard" -> TrackPriority.STANDARD
    "high" -> TrackPriority.HIGH
    else -> throw InvalidTrackPriorityException()
  }
}

class InvalidTrackSwitchOffModeException : Exception()

fun trackSwitchOffModeFromReactTrackSwitchOffMode(reactTrackSwitchOffMode: String): TrackSwitchOffMode {
  return when (reactTrackSwitchOffMode) {
    "predicted" -> TrackSwitchOffMode.PREDICTED
    "detected" -> TrackSwitchOffMode.DETECTED
    "disabled" -> TrackSwitchOffMode.DISABLED
    else -> throw InvalidTrackSwitchOffModeException()
  }
}

data class VideoDimensionsParams(
  val width: Int,
  val height: Int
) {

  fun toVideoDimensions(): VideoDimensions {
    return VideoDimensions(width, height)
  }
}

data class RenderDimensionsParams(
  val low: VideoDimensionsParams,
  val standard: VideoDimensionsParams,
  val high: VideoDimensionsParams
) {

  fun toVideoRenderDimensions(): Map<TrackPriority, VideoDimensions> {
    return mapOf(
      Pair(TrackPriority.HIGH, high.toVideoDimensions()),
      Pair(TrackPriority.STANDARD, standard.toVideoDimensions()),
      Pair(TrackPriority.LOW, low.toVideoDimensions())
    )
  }
}

class InvalidVideoCodecException : Exception()

data class VideoCodecParams(
  val codec: String,
  val simulcast: Boolean?
) {

  fun toVideoCodec(): VideoCodec {
    return when (codec) {
      "h264" -> H264Codec()
      "vp9" -> Vp9Codec()
      "vp8" -> if (simulcast != null) Vp8Codec(simulcast) else Vp8Codec()
      else -> throw InvalidVideoCodecException()
    }
  }
}

data class ConnectOptionsBandwidthProfileVideoParams(
  val mode: String?,
  val maxTracks: Long?,
  val dominantSpeakerPriority: String?,
  val trackSwitchOffMode: String?,
  val renderDimensions: RenderDimensionsParams?,
  val maxSubscriptionBitrate: Long?
) {
  fun toVideoBandwidthProfileOptions(): VideoBandwidthProfileOptions {
    val mode = if (this.mode == null) null else bandwidthProfileModeFromReactBandwidthProfileMode(this.mode)
    val dominantSpeakerPriority = if (this.dominantSpeakerPriority == null) null else trackPriorityFromReactTrackPriority(this.dominantSpeakerPriority)
    val trackSwitchOffMode = if (this.trackSwitchOffMode == null) null else trackSwitchOffModeFromReactTrackSwitchOffMode(this.trackSwitchOffMode)

    val builder = VideoBandwidthProfileOptions.Builder()

    if (mode != null) {
      builder.mode(mode)
    }
    if (maxTracks != null) {
      builder.maxTracks(maxTracks)
    }
    if (dominantSpeakerPriority != null) {
      builder.dominantSpeakerPriority(dominantSpeakerPriority)
    }
    if (trackSwitchOffMode != null) {
      builder.trackSwitchOffMode(trackSwitchOffMode)
    }
    if (renderDimensions != null) {
      builder.renderDimensions(renderDimensions.toVideoRenderDimensions())
    }
    if (maxSubscriptionBitrate != null) {
      builder.maxSubscriptionBitrate(maxSubscriptionBitrate)
    }

    return builder.build()
  }
}

data class ConnectOptionsBandwidthProfileParams(
  val video: ConnectOptionsBandwidthProfileVideoParams
) {

  fun toBandwidthProfileOptions(): BandwidthProfileOptions {
    return BandwidthProfileOptions(video.toVideoBandwidthProfileOptions())
  }
}

data class ConnectOptionsEncodingParametersParams(
  val audioBitrate: Int,
  val videoBitrate: Int
) {

  fun toEncodingParameters(): EncodingParameters {
    return EncodingParameters(audioBitrate, videoBitrate)
  }
}

data class ConnectOptionsNetworkQualityConfigurationParams(
  val local: String,
  val remote: String
) {

  fun toNetworkQualityConfiguration(): NetworkQualityConfiguration {
    return NetworkQualityConfiguration(
      networkQualityVerbosityFromReactNetworkQualityVerbosity(local),
      networkQualityVerbosityFromReactNetworkQualityVerbosity(remote)
    )
  }
}

class AudioTracksNotFoundException : Exception()
class VideoTracksNotFoundException : Exception()

data class ConnectOptionsParams(
  val roomName: String?,
  val audioTrackNames: List<String>?,
  val videoTrackNames: List<String>?,
  val isAutomaticSubscriptionEnabled: Boolean?,
  val isNetworkQualityEnabled: Boolean?,
  val isInsightsEnabled: Boolean?,
  val networkQualityConfiguration: ConnectOptionsNetworkQualityConfigurationParams?,
  val isDominantSpeakerEnabled: Boolean?,
  val encodingParameters: ConnectOptionsEncodingParametersParams?,
  val bandwidthProfile: ConnectOptionsBandwidthProfileParams?,
  val preferredVideoCodecs: List<VideoCodecParams>?
) {
  private fun findAudioTracks(dataSource: TwilioVideoSDKReactDataSource): List<LocalAudioTrack>? {
    if (audioTrackNames != null) {
      val audioTracks = audioTrackNames.map { dataSource.findLocalAudioTrack(it) }
      if (audioTracks.all { it != null }) {
        return audioTracks.requireNoNulls()
      } else {
        throw AudioTracksNotFoundException()
      }
    }
    return null
  }

  private fun findVideoTracks(dataSource: TwilioVideoSDKReactDataSource): List<LocalVideoTrack>? {
    if (videoTrackNames != null) {
      val videoTracks = videoTrackNames.map { dataSource.findLocalVideoTrack(it) }
      if (videoTracks.all { it != null }) {
        return videoTracks.requireNoNulls()
      } else {
        throw VideoTracksNotFoundException()
      }
    }
    return null
  }

  fun toConnectOptions(token: String, dataSource: TwilioVideoSDKReactDataSource): ConnectOptions {
    val audioTracks = findAudioTracks(dataSource)
    val videoTracks = findVideoTracks(dataSource)
    val networkQualityConfiguration = this.networkQualityConfiguration?.toNetworkQualityConfiguration()
    val bandwidthProfile = this.bandwidthProfile?.toBandwidthProfileOptions()
    val preferredVideoCodecs = this.preferredVideoCodecs?.map { it.toVideoCodec() }

    val builder = ConnectOptions.Builder(token)
    if (roomName != null) {
      builder.roomName(roomName)
    }
    if (audioTracks != null) {
      builder.audioTracks(audioTracks)
    }
    if (videoTracks != null) {
      builder.videoTracks(videoTracks)
    }
    if (isAutomaticSubscriptionEnabled != null) {
      builder.enableAutomaticSubscription(isAutomaticSubscriptionEnabled)
    }
    if (isNetworkQualityEnabled != null) {
      builder.enableNetworkQuality(isNetworkQualityEnabled)
    }
    if (isInsightsEnabled != null) {
      builder.enableInsights(isInsightsEnabled)
    }
    if (networkQualityConfiguration != null) {
      builder.networkQualityConfiguration(networkQualityConfiguration)
    }
    if (isDominantSpeakerEnabled != null) {
      builder.enableDominantSpeaker(isDominantSpeakerEnabled)
    }
    if (encodingParameters != null) {
      builder.encodingParameters(encodingParameters.toEncodingParameters())
    }
    if (bandwidthProfile != null) {
      builder.bandwidthProfile(bandwidthProfile)
    }
    if (preferredVideoCodecs != null) {
      builder.preferVideoCodecs(preferredVideoCodecs)
    }
    return builder.build()
  }
}
