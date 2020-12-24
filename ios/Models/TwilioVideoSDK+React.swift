//
//  TwilioVideoSDK+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/23/20.
//

import Foundation

enum ConnectError: Error {
    case audioTracksNotFound(names: [String])
    case videoTracksNotFound(names: [String])
    case invalidNetworkQualityVerbosity
    case invalidBandwidthProfileMode
    case invalidTrackPriority
    case invalidTrackSwitchOffMode
    case invalidVideoCodec
}

extension NetworkQualityVerbosity {
    static func fromReactNetworkQualityVerbosity(reactNetworkQualityVerbosity: String) throws -> NetworkQualityVerbosity {
        switch reactNetworkQualityVerbosity {
        case "minimal":
            return .minimal
        case "none":
            return .none
        default:
            throw ConnectError.invalidNetworkQualityVerbosity
        }
    }
}

extension BandwidthProfileMode {
    static func fromReactBandwidthProfileMode(reactBandwidthProfileMode: String) throws -> BandwidthProfileMode {
        switch reactBandwidthProfileMode {
        case "grid":
            return .grid
        case "collaboration":
            return .collaboration
        case "presentation":
            return .presentation
        default:
            throw ConnectError.invalidBandwidthProfileMode
        }
    }
}

extension Track.Priority {
    static func fromReactTrackPriority(reactTrackPriority: String) throws -> Track.Priority {
        switch reactTrackPriority {
        case "low":
            return .low
        case "standard":
            return .standard
        case "high":
            return .high
        default:
            throw ConnectError.invalidTrackPriority
        }
    }
}

extension Track.SwitchOffMode {
    static func fromReactTrackSwitchOffMode(reactTrackSwitchOffMode: String) throws -> Track.SwitchOffMode {
        switch reactTrackSwitchOffMode {
        case "predicted":
            return .predicted
        case "detected":
            return .detected
        case "disabled":
            return .disabled
        default:
            throw ConnectError.invalidTrackSwitchOffMode
        }
    }
}

struct VideoDimensionsParams: Codable {
    let width: UInt;
    let height: UInt;
    
    func toVideoDimensions() -> VideoDimensions {
        return VideoDimensions(width: width, height: height)
    }
}

struct RenderDimensionsParams: Codable {
    let low: VideoDimensionsParams;
    let standard: VideoDimensionsParams;
    let high: VideoDimensionsParams;
    
    func toVideoRenderDimensions() -> VideoRenderDimensions {
        let videoRenderDimensions = VideoRenderDimensions()
        videoRenderDimensions.high = high.toVideoDimensions()
        videoRenderDimensions.standard = standard.toVideoDimensions()
        videoRenderDimensions.low = low.toVideoDimensions()
        return videoRenderDimensions
    }
}

struct VideoCodecParams: Codable {
    let codec: String
    let simulcast: Bool?
    
    func toVideoCodec() throws -> VideoCodec {
        switch codec {
        case "H264":
            return H264Codec()
        case "VP9":
            return Vp9Codec()
        case "VP8":
            if let simulcast = simulcast {
                return Vp8Codec(simulcast: simulcast)
            } else {
                return Vp8Codec()
            }
        default:
            throw ConnectError.invalidVideoCodec
        }
    }
}

struct ConnectOptionsBandwidthProfileVideoParams: Codable {
    let mode: String?
    let maxTracks: Int?
    let dominantSpeakerPriority: String?
    let trackSwitchOffMode: String?
    let renderDimensions: RenderDimensionsParams?
    let maxSubscriptionBitrate: UInt?
    
    func toVideoBandwidthProfileOptions() throws -> VideoBandwidthProfileOptions {
        let mode = self.mode == nil ? nil : try BandwidthProfileMode.fromReactBandwidthProfileMode(reactBandwidthProfileMode: self.mode!)
        let dominantSpeakerPriority = self.dominantSpeakerPriority == nil ? nil : try Track.Priority.fromReactTrackPriority(reactTrackPriority: self.dominantSpeakerPriority!)
        let trackSwitchOffMode = self.trackSwitchOffMode == nil ? nil : try Track.SwitchOffMode.fromReactTrackSwitchOffMode(reactTrackSwitchOffMode: self.trackSwitchOffMode!)
        
        return VideoBandwidthProfileOptions { (builder) in
            if let mode = mode {
                builder.mode = mode
            }
            if let maxTracks = maxTracks {
                builder.maxTracks = NSNumber(value: maxTracks)
            }
            if let dominantSpeakerPriority = dominantSpeakerPriority {
                builder.dominantSpeakerPriority = dominantSpeakerPriority
            }
            if let trackSwitchOffMode = trackSwitchOffMode {
                builder.trackSwitchOffMode = trackSwitchOffMode
            }
            if let renderDimensions = renderDimensions {
                builder.renderDimensions = renderDimensions.toVideoRenderDimensions()
            }
            if let maxSubscriptionBitrate = maxSubscriptionBitrate {
                builder.maxSubscriptionBitrate = NSNumber(value: maxSubscriptionBitrate)
            }
        }
    }
}

struct ConnectOptionsBandwidthProfileParams: Codable {
    let video: ConnectOptionsBandwidthProfileVideoParams;
    
    func toBandwidthProfileOptions() throws -> BandwidthProfileOptions {
        return BandwidthProfileOptions(videoOptions: try video.toVideoBandwidthProfileOptions())
    }
}

struct ConnectOptionsEncodingParametersParams: Codable {
    let audioBitrate: UInt;
    let videoBitrate: UInt
    
    func toEncodingParameters() -> EncodingParameters {
        return EncodingParameters(audioBitrate: audioBitrate, videoBitrate: videoBitrate)
    }
}

struct ConnectOptionsNetworkQualityConfigurationParams: Codable {
    let local: String
    let remote: String
    
    func toNetworkQualityConfiguration() throws -> NetworkQualityConfiguration {
        return NetworkQualityConfiguration(
            localVerbosity: try NetworkQualityVerbosity.fromReactNetworkQualityVerbosity(reactNetworkQualityVerbosity: local),
            remoteVerbosity: try NetworkQualityVerbosity.fromReactNetworkQualityVerbosity(reactNetworkQualityVerbosity: remote)
        )!
    }
}

struct ConnectOptionsParams: Codable {
    let roomName: String?
    let audioTrackNames: [String]?
    let videoTrackNames: [String]?
    let isAutomaticSubscriptionEnabled: Bool?
    let isNetworkQualityEnabled: Bool?
    let isInsightsEnabled: Bool?
    let networkQualityConfiguration: ConnectOptionsNetworkQualityConfigurationParams?
    let isDominantSpeakerEnabled: Bool?
    let encodingParameters: ConnectOptionsEncodingParametersParams?
    let bandwidthProfile: ConnectOptionsBandwidthProfileParams?
    let preferredVideoCodecs: [VideoCodecParams]?
    
    func findAudioTracks(dataSource: TwilioVideoSDKReactDataSource) throws -> [LocalAudioTrack]? {
        if let audioTrackNames = audioTrackNames {
            let audioTracks = audioTrackNames.map { dataSource.findLocalAudioTrack(name: $0) }
            if let audioTracks = audioTracks as? [LocalAudioTrack] {
                return audioTracks
            } else {
                let invalidAudioTrackNames = audioTrackNames.filter { dataSource.findLocalAudioTrack(name: $0) == nil }
                throw ConnectError.audioTracksNotFound(names: invalidAudioTrackNames)
            }
        }
        return nil
    }
    
    func findVideoTracks(dataSource: TwilioVideoSDKReactDataSource) throws -> [LocalVideoTrack]? {
        if let videoTrackNames = videoTrackNames {
            let videoTracks = videoTrackNames.map { dataSource.findLocalVideoTrack(name: $0) }
            if let videoTracks = videoTracks as? [LocalVideoTrack] {
                return videoTracks
            } else {
                let invalidVideoTrackNames = videoTrackNames.filter { dataSource.findLocalVideoTrack(name: $0) == nil }
                throw ConnectError.videoTracksNotFound(names: invalidVideoTrackNames)
            }
        }
        return nil
    }
    
    func toConnectOptions(token: String, dataSource: TwilioVideoSDKReactDataSource) throws -> ConnectOptions {
        let audioTracks = try findAudioTracks(dataSource: dataSource)
        let videoTracks = try findVideoTracks(dataSource: dataSource)
        let networkQualityConfiguration = try self.networkQualityConfiguration?.toNetworkQualityConfiguration()
        let bandwidthProfile = try self.bandwidthProfile?.toBandwidthProfileOptions()
        let preferredVideoCodecs = try self.preferredVideoCodecs?.map { try $0.toVideoCodec() }
        
        return ConnectOptions(token: token) { (builder) in
            builder.roomName = roomName
            if let audioTracks = audioTracks {
                builder.audioTracks = audioTracks
            }
            if let videoTracks = videoTracks {
                builder.videoTracks = videoTracks
            }
            if let isAutomaticSubscriptionEnabled = isAutomaticSubscriptionEnabled {
                builder.isAutomaticSubscriptionEnabled = isAutomaticSubscriptionEnabled
            }
            if let isNetworkQualityEnabled = isNetworkQualityEnabled {
                builder.isNetworkQualityEnabled = isNetworkQualityEnabled
            }
            if let isInsightsEnabled = isInsightsEnabled {
                builder.areInsightsEnabled = isInsightsEnabled
            }
            if let networkQualityConfiguration = networkQualityConfiguration {
                builder.networkQualityConfiguration = networkQualityConfiguration
            }
            if let isDominantSpeakerEnabled = isDominantSpeakerEnabled {
                builder.isDominantSpeakerEnabled = isDominantSpeakerEnabled
            }
            if let encodingParameters = encodingParameters {
                builder.encodingParameters = encodingParameters.toEncodingParameters()
            }
            if let bandwidthProfile = bandwidthProfile {
                builder.bandwidthProfileOptions = bandwidthProfile
            }
            if let preferredVideoCodecs = preferredVideoCodecs {
                builder.preferredVideoCodecs = preferredVideoCodecs
            }
        }
    }
}

protocol TwilioVideoSDKReactDataSource {
    func findLocalVideoTrack(name: String) -> LocalVideoTrack?
    func findLocalAudioTrack(name: String) -> LocalAudioTrack?
}

extension TwilioVideoSDK {
    class func connectFromReact(
        token: String,
        params: ConnectOptionsParams,
        delegate: RoomDelegate?,
        dataSource: TwilioVideoSDKReactDataSource
    ) throws -> Room {
        let options = try params.toConnectOptions(token: token, dataSource: dataSource)
        return TwilioVideoSDK.connect(options: options, delegate: delegate)
    }
}
