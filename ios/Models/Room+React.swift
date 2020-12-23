//
//  Room.swift
//  react-native-twilio-video
//
//  Created by Kevin Finn on 11/29/20.
//

import Foundation

extension Room.State {
    func toReactRoomState() -> String {
        switch self {
        case .connected:
            return "connected"
        case .connecting:
            return "connecting"
        case .disconnected:
            return "disconnected"
        case .reconnecting:
            return "reconnecting"
        default:
            return "disconnected"
        }
    }
}

extension Room {
    func toReactAttributes() -> [String: Any] {
        return [
            "sid": sid,
            "name": name,
            "state": state.toReactRoomState(),
            "isRecording": isRecording,
            "localParticipant": localParticipant?.toReactAttributes() as Any,
            "remoteParticipants": remoteParticipants.map { $0.toReactAttributes() },
            "dominantSpeaker": dominantSpeaker?.toReactAttributes() as Any
        ]
    }
}
