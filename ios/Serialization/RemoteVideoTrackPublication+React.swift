//
//  RemoteVideoTrackPublication+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 11/30/20.
//

import Foundation

extension RemoteVideoTrackPublication {
    func toReactAttributes() -> [String: Any] {
        return [
            "isTrackSubscribed": isTrackSubscribed,
            "remoteTrack": remoteTrack?.toReactAttributes() as Any,
            "publishPriority": publishPriority.toReactTrackPriority() as Any,
            "isTrackEnabled": isTrackEnabled,
            "trackName": trackName,
            "trackSid": trackSid
        ]
    }
}
