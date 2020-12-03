//
//  LocalAudioTrack+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/1/20.
//

import Foundation

struct LocalAudioTrackCreateOptionsParams: Codable {
    let audioJitterBufferMaxPackets: Int32?
    let audioJitterBufferFastAccelerate: Bool?
    let softwareAecEnabled: Bool?
    let highpassFilter: Bool?
    
    func toAudioOptions() -> AudioOptions {
        return AudioOptions() { (builder) in
            if let audioJitterBufferMaxPackets = audioJitterBufferMaxPackets {
                builder.audioJitterBufferMaxPackets = audioJitterBufferMaxPackets
            }
            
            if let audioJitterBufferFastAccelerate = audioJitterBufferFastAccelerate {
                builder.audioJitterBufferFastAccelerate = audioJitterBufferFastAccelerate
            }
            
            if let softwareAecEnabled = softwareAecEnabled {
                builder.isSoftwareAecEnabled = softwareAecEnabled
            }
            
            if let highpassFilter = highpassFilter {
                builder.highpassFilter = highpassFilter
            }
        }
    }
}

struct LocalAudioTrackCreateParams: Codable {
    let options: LocalAudioTrackCreateOptionsParams?
    let enabled: Bool?
    let name: String?
    
    var isEmpty: Bool {
        return options == nil && enabled == nil && name == nil
    }
}

extension LocalAudioTrack {
    func toReactAttributes() -> [String: Any] {
        return [
            "isEnabled": isEnabled,
            "name": name,
            "state": state.toReactTrackState() as Any
        ]
    }
    
    class func createFromReact(params: LocalAudioTrackCreateParams) -> LocalAudioTrack? {
        if params.isEmpty {
            return LocalAudioTrack()
        } else {
            return LocalAudioTrack(
                options: params.options?.toAudioOptions(),
                enabled: params.enabled ?? true,
                name: params.name
            )
        }
    }
    
    func destroyFromReact() {
        isEnabled = false
    }
}
