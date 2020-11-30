//
//  RemoteDataTrack+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 11/30/20.
//

import Foundation

extension RemoteDataTrack {
    func toReactAttributes() -> [String: Any] {
        return [
            "sid": sid,
            "isEnabled": isEnabled,
            "name": name,
            "state": state.toReactTrackState() as Any
        ]
    }
}
