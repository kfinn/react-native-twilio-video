//
//  RemoteAudioTrack+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 11/30/20.
//

import Foundation

struct RemoteAudioTrackUpdateParams: Codable {
    let isPlaybackEnabled: Bool?
}

extension RemoteAudioTrack {
    func toReactAttributes() -> [String: Any] {
        return [
            "isPlaybackEnabled": isPlaybackEnabled,
            "sid": sid,
            "isEnabled": isEnabled,
            "name": name,
            "state": state.toReactTrackState() as Any
        ]
    }
    
    func updateFromReact(params: RemoteAudioTrackUpdateParams) {
        if let isPlaybackEnabled = params.isPlaybackEnabled {
            self.isPlaybackEnabled = isPlaybackEnabled
        }
    }
}
