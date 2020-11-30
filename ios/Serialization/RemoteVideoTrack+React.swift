//
//  RemoteVideoTrack+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 11/30/20.
//

import Foundation

extension RemoteVideoTrack {
    func toReactAttributes() -> [String: Any] {
        return [
            "sid": sid,
            "isSwitchedOff": isSwitchedOff,
            "priority": priority?.toReactTrackPriority() as Any,
            "isEnabled": isEnabled,
            "name": name,
            "state": state.toReactTrackState() as Any
        ]
    }
}
