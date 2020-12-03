//
//  TrackState+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 11/30/20.
//

import Foundation

extension Track.State {
    func toReactTrackState() -> String? {
        switch self {
        case .ended:
            return "ended"
        case .live:
            return "live"
        default:
            return nil
        }
    }
}
