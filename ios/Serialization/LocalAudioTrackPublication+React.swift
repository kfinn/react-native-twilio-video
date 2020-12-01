//
//  LocalAudioTrackPublication+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/1/20.
//

import Foundation

extension LocalAudioTrackPublication {
    func toReactAttributes() -> [String: Any] {
        return [
            "trackSid": trackSid,
            "trackName": trackName,
            "priority": priority.toReactTrackPriority() as Any,
            "localTrack": localTrack?.toReactAttributes() as Any
        ]
    }
}
