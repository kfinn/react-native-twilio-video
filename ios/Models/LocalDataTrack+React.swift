//
//  LocalDataTrack+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 12/1/20.
//

import Foundation

extension LocalDataTrack {
    func toReactAttributes() -> [String: Any] {
        return [
            "isEnabled": isEnabled,
            "name": name,
            "state": state.toReactTrackState() as Any
        ]
    }
}
