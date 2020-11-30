//
//  TrackPriority+React.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 11/30/20.
//

import Foundation

extension Track.Priority {
    func toReactTrackPriority() -> String? {
        switch self {
        case .low:
            return "low"
        case .standard:
            return "standard"
        case .high:
            return "high"
        default:
            return nil
        }
    }
}
